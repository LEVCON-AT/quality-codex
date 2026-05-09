# Postgres Best Practices

Lokale Substanz aus `supabase-postgres-best-practices`-Skill.

## Indexing

### Primary-Key-Strategie
- UUID v4 default (`gen_random_uuid()`) — kein Sequenz-Lock
- Bigint serial nur bei extrem-hot-write-tables
- Composite-PKs vermeiden — eigene UUID-PK + Unique-Index

### Index pro Foreign-Key
```sql
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_tenant_id_idx ON tasks(tenant_id);
```

### Index für häufige WHERE/ORDER-BY
```sql
CREATE INDEX tasks_tenant_created ON tasks(tenant_id, created_at DESC);
```

### Partial-Index für Filtered Queries
```sql
CREATE INDEX tasks_active ON tasks(tenant_id) WHERE deleted_at IS NULL;
```

### GIN für JSONB / Arrays
```sql
CREATE INDEX tasks_tags_gin ON tasks USING GIN(tags);
-- Query: WHERE tags @> '["urgent"]'
```

### Trigram für Fuzzy-Search
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX tasks_title_trgm ON tasks USING GIN(title gin_trgm_ops);
-- Query: WHERE title ILIKE '%foo%'
```

## Query-Optimization

### EXPLAIN ANALYZE
```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM tasks WHERE tenant_id = '...';
```

Achten auf:
- `Seq Scan` bei großen Tabellen → Index fehlt
- Hohe `cost` → Query restrukturieren
- `Hash Join` bei großen Datensätzen — meist OK
- `Nested Loop` mit hoher Loop-Anzahl → Index oder JOIN-Reihenfolge prüfen

### N+1-Vermeidung
```typescript
// ❌ schlecht
for (const task of tasks) {
  task.user = await supabase.from('users').select().eq('id', task.user_id).single();
}

// ✓ JOIN/Embed
const { data } = await supabase.from('tasks').select(`
  *,
  user:users(id, name, email)
`);
```

### Pagination
- `LIMIT` + `OFFSET` ist langsam bei großen Tabellen → Cursor-based:
```sql
SELECT * FROM tasks
WHERE tenant_id = $1 AND created_at < $2
ORDER BY created_at DESC
LIMIT 20;
```

## JSONB-Patterns

### Wann JSONB
- Schemaless Metadata
- Arrays of objects
- User-defined Custom-Fields

### Wann nicht JSONB
- Primäre Identitäts-Felder
- Felder mit häufigen Filter/Joins
- Felder die typensicher sein müssen → eigene Spalte

### JSONB-Operations
```sql
-- contains
WHERE meta @> '{"status": "active"}'

-- key-exists
WHERE meta ? 'priority'

-- path-extract
SELECT meta->>'priority' AS priority

-- update sub-key
UPDATE tasks SET meta = jsonb_set(meta, '{priority}', '"high"') WHERE id = $1;
```

## Connection-Pooling

### Supabase Cloud
- **Pooler (Supavisor)** Pflicht für serverless / edge / hot-client
- Direct-Connection nur für Migrations / Long-running

### Self-Hosted
- **PgBouncer** transaction-pooling
- Connection-Limit pro App: 10-20 (PgBouncer hat eigene Pool von 100+)
- `prepared_statements = false` bei transaction-pooling

## Performance-Anti-Patterns

- ❌ `SELECT *` in Production-Queries (column-list explizit)
- ❌ Funktionen in WHERE-Clause (Index unwirksam): `WHERE LOWER(email) = ...`
- ❌ Implizite Type-Casts (kein Index): `WHERE user_id::text = '...'`
- ❌ OR statt UNION: `WHERE a = 1 OR b = 2` ist oft langsamer als 2 indices + UNION
- ❌ Zu viele Indexes (Insert-Cost steigt)
- ❌ `COUNT(*)` ohne WHERE (full-scan)

## RLS-Performance

RLS-Policies werden bei jedem Query evaluated. Performance-Tipps:
- Index auf RLS-Filter-Columns (`user_id`, `tenant_id`)
- Subquery-Policies durch Function-Wrapping cachen:
```sql
CREATE OR REPLACE FUNCTION user_has_workspace(ws_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE user_id = auth.uid() AND workspace_id = ws_id
  );
$$;

CREATE POLICY tasks_in_workspace ON tasks USING (user_has_workspace(workspace_id));
```

## Backup-Strategy

- **Daily pg_dump** → encrypted upload (siehe `runbooks/db-restore.md`)
- **WAL-Archiving** für Point-in-Time-Recovery (Supabase Cloud Pro+)
- **Retention:** 7 daily / 4 weekly / 12 monthly (GFS)
- **Restore-Verify:** wöchentlich automated drill

## Postgres-Extensions (häufig genutzt)

- `pgcrypto` — Encryption-at-rest für PII
- `pg_trgm` — Fuzzy-Search
- `pgvector` — Embeddings (für AI/Search)
- `pg_cron` — Scheduled Jobs (Cleanup, Retention)
- `pg_graphql` — GraphQL-API on top of Postgres (Supabase-Default)
- `uuid-ossp` — alternative UUID-Generators

## Monitoring

- `pg_stat_statements` — Query-Statistik
- `pg_stat_activity` — laufende Queries
- Connection-Count Alarm bei >80% Pool-Utilization
- Slow-Query-Log (queries >1s loggen)
