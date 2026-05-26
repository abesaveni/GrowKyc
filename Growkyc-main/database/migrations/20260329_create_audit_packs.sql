create table if not exists audit_packs (
  id text primary key,
  tenant_id text not null,
  case_id text not null,
  export_status text not null,
  generated_at timestamptz not null,
  generated_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_audit_packs_tenant_id
  on audit_packs (tenant_id);

create index if not exists idx_audit_packs_case_id
  on audit_packs (case_id);

create index if not exists idx_audit_packs_export_status
  on audit_packs (export_status);

create index if not exists idx_audit_packs_generated_at
  on audit_packs (generated_at);
