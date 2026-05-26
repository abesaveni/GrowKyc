create table if not exists report_records (
  report_id text primary key,
  tenant_id text not null,
  case_id text,
  report_type text not null,
  status text not null,
  generated_at timestamptz,
  generated_by text,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_report_records_tenant_id
  on report_records (tenant_id);

create index if not exists idx_report_records_case_id
  on report_records (case_id);

create index if not exists idx_report_records_report_type
  on report_records (report_type);

create index if not exists idx_report_records_status
  on report_records (status);

create index if not exists idx_report_records_generated_at
  on report_records (generated_at);