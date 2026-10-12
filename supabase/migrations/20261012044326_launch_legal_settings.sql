alter table public.site_settings
  add column legal_ruc text check (legal_ruc is null or legal_ruc ~ '^[0-9]{11}$'),
  add column legal_address text check (legal_address is null or char_length(legal_address) <= 250),
  add column complaints_url text check (complaints_url is null or complaints_url ~ '^https://');
create index site_settings_owner_id_idx on public.site_settings(owner_id);
