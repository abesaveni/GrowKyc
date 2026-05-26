create table if not exists override_reasons (
  id text primary key,
  tenant_id text not null,
  case_id text not null,
  actor_id text not null,
  category text not null,
  target_type text not null,
  target_id text not null,
  reason_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_override_reasons_tenant_id
  on override_reasons (tenant_id);

create index if not exists idx_override_reasons_case_id
  on override_reasons (case_id);

create index if not exists idx_override_reasons_target
  on override_reasons (target_type, target_id);

create index if not exists idx_override_reasons_actor_id
  on override_reasons (actor_id);
