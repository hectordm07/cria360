-- Owner permissions and trial checks, using generated fixtures. No real records modified.
begin;
do $$
declare
 owner_one uuid:=gen_random_uuid(); owner_two uuid:=gen_random_uuid(); expired_owner uuid:=gen_random_uuid();
 breeder_one uuid; breeder_two uuid; breeder_expired uuid; animal_one uuid; animal_two uuid; expired_animal uuid; n integer; blocked boolean;
begin
 insert into auth.users(id,email,created_at) values
 (owner_one,owner_one::text||'@inventory-test.invalid',now()),
 (owner_two,owner_two::text||'@inventory-test.invalid',now()),
 (expired_owner,expired_owner::text||'@inventory-test.invalid',now()-interval '40 days');
 insert into public.breeders(owner_id,name,slug,primary_species) values(owner_one,'Fixture',owner_one::text,'Aves') returning id into breeder_one;
 insert into public.breeders(owner_id,name,slug,primary_species) values(owner_two,'Fixture',owner_two::text,'Aves') returning id into breeder_two;
 insert into public.breeders(owner_id,name,slug,primary_species) values(expired_owner,'Fixture',expired_owner::text,'Aves') returning id into breeder_expired;
 insert into public.animals(owner_id,breeder_id,name,species) values(owner_one,breeder_one,'Own fixture','Aves') returning id into animal_one;
 insert into public.animals(owner_id,breeder_id,name,species) values(owner_two,breeder_two,'Foreign fixture','Aves') returning id into animal_two;
 insert into public.animals(owner_id,breeder_id,name,species) values(expired_owner,breeder_expired,'Expired fixture','Aves') returning id into expired_animal;
 perform set_config('request.jwt.claims',json_build_object('sub',owner_one,'role','authenticated')::text,true);
 execute 'set local role authenticated';
 update public.animals set name='Edited fixture',species='Patos' where id=animal_one;
 get diagnostics n=row_count; if n<>1 then raise exception 'FAIL own edit'; end if;
 update public.animals set name='Invalid edit' where id=animal_two;
 get diagnostics n=row_count; if n<>0 then raise exception 'FAIL foreign edit'; end if;
 delete from public.animals where id=animal_two;
 get diagnostics n=row_count; if n<>0 then raise exception 'FAIL foreign delete'; end if;
 delete from public.animals where id=animal_one;
 get diagnostics n=row_count; if n<>1 then raise exception 'FAIL own delete'; end if;
 perform set_config('request.jwt.claims',json_build_object('sub',expired_owner,'role','authenticated')::text,true);
 blocked:=false;
 begin update public.animals set name='Forbidden edit' where id=expired_animal;
 exception when others then if sqlerrm not like '%trial_expired%' then raise; end if; blocked:=true; end;
 if not blocked then raise exception 'FAIL expired edit'; end if;
 delete from public.animals where id=expired_animal;
 get diagnostics n=row_count; if n<>1 then raise exception 'FAIL expired owner deletion'; end if;
end;
$$;
select 'PASS: owner edit/delete, foreign edit/delete blocked, expired edit blocked, expired deletion allowed. Fixtures rolled back.' as verification;
rollback;
