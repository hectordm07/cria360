-- Run through an administrative SQL connection. Everything is rolled back.
begin;
do $$
declare
  active_id uuid := gen_random_uuid(); expired_id uuid := gen_random_uuid(); paid_id uuid := gen_random_uuid();
  active_breeder uuid; expired_breeder uuid; paid_breeder uuid; animal_one uuid; animal_two uuid;
  before_start timestamptz; before_end timestamptz; n integer; rejected boolean;
begin
  insert into auth.users(id,email,created_at) values
    (active_id,active_id::text || '@trial-test.invalid',now()),
    (expired_id,expired_id::text || '@trial-test.invalid',now()-interval '720 hours'),
    (paid_id,paid_id::text || '@trial-test.invalid',now()-interval '1440 hours');
  if (select count(*) from public.profiles where id in (active_id,expired_id,paid_id)) <> 3 then raise exception 'FAIL: signup profile creation'; end if;
  update public.profiles set plan='criador' where id=paid_id;
  insert into public.breeders(owner_id,name,slug,primary_species) values(active_id,'Trial fixture',active_id::text,'Aves') returning id into active_breeder;
  insert into public.breeders(owner_id,name,slug,primary_species) values(expired_id,'Trial fixture',expired_id::text,'Aves') returning id into expired_breeder;
  insert into public.breeders(owner_id,name,slug,primary_species) values(paid_id,'Trial fixture',paid_id::text,'Aves') returning id into paid_breeder;
  insert into public.animals(owner_id,breeder_id,name,species) values(expired_id,expired_breeder,'Expired fixture','Ave');

  perform set_config('request.jwt.claims',json_build_object('sub',active_id,'role','authenticated')::text,true);
  execute 'set local role authenticated';
  select trial_started_at,trial_ends_at into before_start,before_end from public.profiles where id=active_id;
  if before_end-before_start <> interval '720 hours' then raise exception 'FAIL: trial duration'; end if;
  rejected := false;
  begin update public.profiles set plan='profesional' where id=active_id;
  exception when others then if sqlerrm not like '%account_entitlement_immutable%' then raise; end if; rejected:=true; end;
  if not rejected then raise exception 'FAIL: self upgrade allowed'; end if;
  rejected := false;
  begin update public.profiles set trial_ends_at=now()+interval '2000 hours' where id=active_id;
  exception when others then if sqlerrm not like '%account_entitlement_immutable%' then raise; end if; rejected:=true; end;
  if not rejected then raise exception 'FAIL: trial reset allowed'; end if;
  update public.profiles set full_name='Updated fixture' where id=active_id;
  if (select trial_ends_at from public.profiles where id=active_id) <> before_end then raise exception 'FAIL: profile edit restarts trial'; end if;
  -- Simulate the onboarding UPSERT on an existing account.
  insert into public.profiles(id,email,full_name,onboarding_completed) values(active_id,active_id::text||'@trial-test.invalid','Updated fixture',true)
    on conflict(id) do update set full_name=excluded.full_name,onboarding_completed=excluded.onboarding_completed;
  if (select trial_ends_at from public.profiles where id=active_id) <> before_end then raise exception 'FAIL: upsert restarts trial'; end if;
  insert into public.animals(owner_id,breeder_id,name,species)
    select active_id,active_breeder,'Fixture '||i,'Ave' from generate_series(1,5) i;
  rejected := false;
  begin insert into public.animals(owner_id,breeder_id,name,species) values(active_id,active_breeder,'Over capacity','Ave');
  exception when others then if sqlerrm not like '%plan_limit_animals%' then raise; end if; rejected:=true; end;
  if not rejected then raise exception 'FAIL: sixth animal allowed'; end if;
  select id into animal_one from public.animals where owner_id=active_id order by id limit 1;
  select id into animal_two from public.animals where owner_id=active_id and id<>animal_one order by id limit 1;
  update public.animals set publication_status='publicado' where id=animal_one;
  rejected := false;
  begin update public.animals set publication_status='publicado' where id=animal_two;
  exception when others then if sqlerrm not like '%plan_limit_publications%' then raise; end if; rejected:=true; end;
  if not rejected then raise exception 'FAIL: second publication allowed'; end if;
  insert into public.farm_transactions(owner_id,breeder_id,type,concept,amount_pen) values(active_id,active_breeder,'gasto','Trial fixture',1);

  perform set_config('request.jwt.claims',json_build_object('sub',expired_id,'role','authenticated')::text,true);
  rejected := false;
  begin insert into public.farm_transactions(owner_id,breeder_id,type,concept,amount_pen) values(expired_id,expired_breeder,'gasto','Expired fixture',1);
  exception when others then if sqlerrm not like '%trial_expired%' then raise; end if; rejected:=true; end;
  if not rejected then raise exception 'FAIL: expired finance write allowed'; end if;
  rejected := false;
  begin insert into public.animals(owner_id,breeder_id,name,species) values(expired_id,expired_breeder,'Expired fixture','Ave');
  exception when others then if sqlerrm not like '%trial_expired%' then raise; end if; rejected:=true; end;
  if not rejected then raise exception 'FAIL: expired animal write allowed'; end if;
  select count(*) into n from public.animals where owner_id=expired_id;
  if n<>1 then raise exception 'FAIL: expired account cannot read its data'; end if;
  if exists(select 1 from public.profiles where id=active_id) then raise exception 'FAIL: profile ownership'; end if;
  select id into animal_one from public.animals where owner_id=expired_id limit 1;
  rejected := false;
  begin perform public.register_animal_inventory_exit(animal_one,'vendido',null);
  exception when others then if sqlerrm not like '%trial_expired%' then raise; end if; rejected:=true; end;
  if not rejected then raise exception 'FAIL: expired RPC bypass'; end if;

  perform set_config('request.jwt.claims',json_build_object('sub',paid_id,'role','authenticated')::text,true);
  insert into public.farm_transactions(owner_id,breeder_id,type,concept,amount_pen) values(paid_id,paid_breeder,'gasto','Paid fixture',1);
  insert into public.profiles(id,email,full_name,onboarding_completed) values(paid_id,paid_id::text||'@trial-test.invalid','Paid fixture',true)
    on conflict(id) do update set full_name=excluded.full_name,onboarding_completed=excluded.onboarding_completed;
  if (select plan from public.profiles where id=paid_id)<>'criador' then raise exception 'FAIL: onboarding overwrites paid plan'; end if;
  rejected := false;
  begin insert into public.farm_transactions(owner_id,breeder_id,type,concept,amount_pen) values(paid_id,active_breeder,'gasto','Wrong breeder',1);
  exception when others then if sqlerrm not like '%breeder_owner_required%' then raise; end if; rejected:=true; end;
  if not rejected then raise exception 'FAIL: foreign breeder accepted'; end if;
end;
$$;
select 'PASS: signup, 30 days, immutable deadline/plan, profile edits/upsert, capacity, publication, expiry, RPC, paid plan, ownership. All fixtures rolled back.' as verification;
rollback;
