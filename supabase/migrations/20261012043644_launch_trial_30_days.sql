-- CRIA360: an immutable 30-day trial begins at the first Auth email registration.
-- Private definer triggers only look up Auth timestamps or seed an owned profile.
create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

alter table public.profiles
  add column trial_started_at timestamptz,
  add column trial_ends_at timestamptz,
  add column terms_accepted_at timestamptz,
  add column terms_version text;

update public.profiles p
set trial_started_at = u.created_at,
    trial_ends_at = u.created_at + interval '720 hours'
from auth.users u where u.id = p.id;

alter table public.profiles
  add constraint profiles_trial_duration check (trial_ends_at = trial_started_at + interval '720 hours');

create function app_private.protect_account_entitlement()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  registered_at timestamptz;
  registered_email text;
  client_request boolean := current_setting('role', true) in ('authenticated', 'anon') or auth.uid() is not null;
begin
  if tg_op = 'UPDATE' and new.id is distinct from old.id then
    raise exception 'account_identity_immutable';
  end if;
  if client_request then
    if auth.uid() is null or new.id is distinct from auth.uid() then
      raise exception 'account_owner_required';
    end if;
    if tg_op = 'INSERT' and new.plan <> 'gratis' then
      raise exception 'plan_change_requires_admin';
    end if;
    if tg_op = 'UPDATE' and (new.plan is distinct from old.plan
      or new.trial_started_at is distinct from old.trial_started_at
      or new.trial_ends_at is distinct from old.trial_ends_at
      or new.created_at is distinct from old.created_at) then
      raise exception 'account_entitlement_immutable';
    end if;
  end if;
  select u.created_at, u.email into registered_at, registered_email from auth.users u where u.id = new.id;
  if registered_at is null or registered_email is null then raise exception 'email_registration_required'; end if;
  -- Ignore client supplied trial dates, including when a profile is deleted/recreated.
  new.trial_started_at := registered_at;
  new.trial_ends_at := registered_at + interval '720 hours';
  new.email := registered_email;
  if tg_op = 'INSERT' then new.created_at := registered_at; end if;
  if client_request and new.terms_accepted_at is not null then
    if tg_op = 'INSERT' then new.terms_accepted_at := now();
    elsif old.terms_accepted_at is null then new.terms_accepted_at := now();
    else new.terms_accepted_at := old.terms_accepted_at; new.terms_version := old.terms_version;
    end if;
  end if;
  return new;
end;
$$;
revoke all on function app_private.protect_account_entitlement() from public, anon, authenticated;
create trigger protect_account_entitlement before insert or update on public.profiles
  for each row execute function app_private.protect_account_entitlement();

create function app_private.seed_email_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_schema <> 'auth' or tg_table_name <> 'users' or tg_op <> 'INSERT' then
    raise exception 'auth_trigger_only';
  end if;
  if new.email is not null then
    insert into public.profiles(id, email, full_name) values(new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', '')) on conflict(id) do nothing;
  end if;
  return new;
end;
$$;
revoke all on function app_private.seed_email_profile() from public, anon, authenticated;
create trigger cria360_seed_email_profile after insert on auth.users
  for each row execute function app_private.seed_email_profile();
-- Existing Auth accounts without onboarding get the same original deadline.
insert into public.profiles(id,email,full_name)
select id,email,coalesce(raw_user_meta_data->>'full_name','') from auth.users where email is not null on conflict(id) do nothing;
alter table public.profiles alter column trial_started_at set not null, alter column trial_ends_at set not null;

create function app_private.enforce_account_write()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare
  account_plan text;
  deadline timestamptz;
  animal_limit integer;
  publication_limit integer;
  current_count integer;
begin
  -- Administrative repairs remain possible. Data API callers cannot bypass this branch.
  if current_setting('role', true) not in ('authenticated','anon') and auth.uid() is null then return new; end if;
  if auth.uid() is null or new.owner_id is distinct from auth.uid() then raise exception 'account_owner_required'; end if;
  -- Serialize writes for one owner so parallel requests cannot exceed plan capacity.
  select p.plan,p.trial_ends_at into account_plan,deadline from public.profiles p
    where p.id = auth.uid() for update;
  if not found then raise exception 'account_plan_unavailable'; end if;
  if account_plan = 'gratis' and deadline <= now() then raise exception 'trial_expired'; end if;
  if account_plan not in ('gratis','criador','profesional') then raise exception 'account_plan_unavailable'; end if;
  if not exists (select 1 from public.breeders b where b.id = new.breeder_id and b.owner_id = auth.uid()) then
    raise exception 'breeder_owner_required';
  end if;
  if tg_table_name = 'animals' then
    animal_limit := case account_plan when 'gratis' then 5 when 'criador' then 150 else 1000 end;
    publication_limit := case account_plan when 'gratis' then 1 when 'criador' then 30 else 2147483647 end;
    if tg_op = 'INSERT' then
      select count(*) into current_count from public.animals where owner_id = auth.uid();
      if current_count >= animal_limit then raise exception 'plan_limit_animals'; end if;
    end if;
    if new.publication_status = 'publicado' then
      select count(*) into current_count from public.animals where owner_id = auth.uid()
        and publication_status = 'publicado' and id <> new.id;
      if current_count >= publication_limit then raise exception 'plan_limit_publications'; end if;
    end if;
    if account_plan = 'gratis' and nullif(trim(new.plate_code),'') is not null then
      select count(*) into current_count from public.animals where owner_id = auth.uid()
        and nullif(trim(plate_code),'') is not null and id <> new.id;
      if current_count >= 1 then raise exception 'plan_limit_plates'; end if;
    end if;
  elsif tg_table_name = 'animal_inventory_movements' then
    if not exists (select 1 from public.animals a where a.id = new.animal_id and a.owner_id = auth.uid()) then
      raise exception 'animal_owner_required';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function app_private.enforce_account_write() from public, anon, authenticated;
create trigger enforce_trial_animals before insert or update on public.animals
  for each row execute function app_private.enforce_account_write();
create trigger enforce_trial_finance before insert or update on public.farm_transactions
  for each row execute function app_private.enforce_account_write();
create trigger enforce_trial_movements before insert or update on public.animal_inventory_movements
  for each row execute function app_private.enforce_account_write();
create trigger enforce_trial_imports before insert or update on public.animal_import_batches
  for each row execute function app_private.enforce_account_write();

-- Uploads also obey the trial; read and owner deletion remain available.
create policy animal_photos_active_plan_insert on storage.objects as restrictive
  for insert to authenticated with check (bucket_id <> 'animal-photos' or exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and (p.plan in ('criador','profesional') or (p.plan = 'gratis' and p.trial_ends_at > now()))));
create policy animal_photos_active_plan_update on storage.objects as restrictive
  for update to authenticated using (bucket_id <> 'animal-photos' or exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and (p.plan in ('criador','profesional') or (p.plan = 'gratis' and p.trial_ends_at > now()))))
  with check (bucket_id <> 'animal-photos' or exists (
    select 1 from public.profiles p where p.id = (select auth.uid())
      and (p.plan in ('criador','profesional') or (p.plan = 'gratis' and p.trial_ends_at > now()))));
