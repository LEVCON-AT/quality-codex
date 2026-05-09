import type { Role } from './types.js';

export const PERMISSIONS = {
  workspace: {
    delete: ['owner'] as Role[],
    update: ['owner', 'admin'] as Role[],
    invite_member: ['owner', 'admin'] as Role[],
    view_settings: ['owner', 'admin'] as Role[],
  },
  task: {
    create: ['owner', 'admin', 'editor'] as Role[],
    update_own: ['owner', 'admin', 'editor'] as Role[],
    update_any: ['owner', 'admin'] as Role[],
    delete_own: ['owner', 'admin', 'editor'] as Role[],
    delete_any: ['owner', 'admin'] as Role[],
    view: ['owner', 'admin', 'editor', 'viewer', 'guest'] as Role[],
  },
  audit_log: {
    view: ['owner', 'admin'] as Role[],
  },
} as const;

export type Resource = keyof typeof PERMISSIONS;
export type Action<R extends Resource> = keyof (typeof PERMISSIONS)[R];

/**
 * Checks whether a role has permission for a resource action.
 * @docs admin/user-management.md#permissions
 */
export function hasPermission<R extends Resource>(
  role: Role,
  resource: R,
  action: Action<R>,
): boolean {
  const allowed = PERMISSIONS[resource][action] as Role[] | undefined;
  return allowed?.includes(role) ?? false;
}
