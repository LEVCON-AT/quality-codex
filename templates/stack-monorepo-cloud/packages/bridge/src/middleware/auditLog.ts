import type { RequestContext } from '@__SLUG__/shared/types';

/**
 * Wraps a privileged action and logs audit event after success.
 * @docs admin/user-management.md#audit-log
 */
export async function withAudit<T>(
  ctx: RequestContext,
  action: string,
  target: { type: string; id: string },
  fn: () => Promise<T>,
): Promise<T> {
  const result = await fn();
  // TODO: db.insert('audit_events', { ... })
  // Skipped in skeleton — wire to Supabase client after setup.
  void ctx;
  void action;
  void target;
  return result;
}
