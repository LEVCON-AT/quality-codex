# Supabase Patterns

Lokale Substanz aus `supabase`-Skill. Lädt bei DB/Auth-Code.

## Auth + RLS — Defense-in-Depth

### Setup
```typescript
// packages/client-web/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);
```

### RLS-Pattern Pflicht
```sql
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_table FORCE ROW LEVEL SECURITY;  -- auch service_role unterliegt RLS

CREATE POLICY my_table_select_own ON my_table
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY my_table_insert_own ON my_table
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY my_table_update_own ON my_table
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY my_table_delete_own ON my_table
  FOR DELETE USING (user_id = auth.uid());
```

### Auth.uid() vs. Service-Role
- **Anon-Key:** RLS aktiv, `auth.uid()` = eingeloggter User
- **Service-Role-Key:** RLS bypass (NIEMALS im Browser/Client!)
- Server-side Mutations wo immer möglich mit User-JWT, nicht Service-Role

## Auth-Flow Patterns

### Magic-Link
```typescript
await supabase.auth.signInWithOtp({
  email,
  options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
});
```

### Password
```typescript
await supabase.auth.signUp({ email, password });
await supabase.auth.signInWithPassword({ email, password });
```

### OAuth (Google, GitHub)
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` }
});
```

### Session-Listener
```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') { /* ... */ }
  if (event === 'SIGNED_OUT') { /* ... */ }
  if (event === 'TOKEN_REFRESHED') { /* ... */ }
});
```

## SSR (Next.js / Solid-SSR)

`@supabase/ssr` für Server-Side-Auth:
```typescript
import { createServerClient } from '@supabase/ssr';

const supabase = createServerClient(url, anonKey, {
  cookies: { get, set, remove }  // Framework-spezifisch
});

const { data: { user } } = await supabase.auth.getUser();
```

**Wichtig:** `getUser()` (validiert mit Server) statt `getSession()` (client-side cache, unsicher) wenn Auth-relevante Entscheidungen serverseitig getroffen werden.

## Realtime

### Subscribe
```typescript
const channel = supabase.channel('tasks-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'tasks',
    filter: `tenant_id=eq.${tenantId}`
  }, payload => {
    handleChange(payload);
  })
  .subscribe();

// Cleanup
return () => supabase.removeChannel(channel);
```

### Presence (wer ist online)
```typescript
const channel = supabase.channel('room-1', { config: { presence: { key: userId } } });
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState();
  setOnlineUsers(Object.keys(state));
}).subscribe();
```

## Storage

### Upload
```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type
  });
```

### RLS auf Bucket
```sql
CREATE POLICY storage_avatars_own ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## Edge Functions

`infra/supabase/functions/<name>/index.ts`:
```typescript
import { serve } from 'https://deno.land/std/http/server.ts';

serve(async (req) => {
  const auth = req.headers.get('authorization');
  // validate JWT, do work
  return new Response(JSON.stringify({ ok: true }));
});
```

Deploy: `supabase functions deploy <name>`

## Migrations

Idempotent + monoton:
```sql
-- 001_init.sql
CREATE TABLE IF NOT EXISTS users (...);

-- 002_add_profile.sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile jsonb DEFAULT '{}'::jsonb;
```

CI 2-Pass-Smoke: Migration läuft 2× hintereinander mit identischem Ergebnis.

## Common Pitfalls

- ❌ `getSession()` für Auth-Entscheidung serverseitig (nutze `getUser()`)
- ❌ `service_role`-Key im Frontend
- ❌ RLS NICHT aktiviert (Default ist OFF!)
- ❌ Realtime ohne Filter (zu viel Traffic)
- ❌ Keine Indexes auf `user_id` / `tenant_id` (Query-Performance)
- ❌ Storage ohne RLS-Policy (Public-Bucket-Leak)
