## RBAC Process – End-to-End (Permissions → Roles → Users → Routes → Menus)

This document is the single source of truth for creating and wiring RBAC in this app. Follow in order; don’t skip steps.

### 0) Concepts we use (current implementation)

- Roles grant permissions via many-to-many `Role ↔ Permission`.
- Users inherit permissions from their current role. Users may also receive direct user-level grants via many-to-many `User ↔ Permission`.
- There is no explicit deny in the current model. Effective permissions = role permissions ∪ user direct grants.
- Route access is checked against configured required permissions, with dynamic path support (e.g., `/admin/roles/[id]/permissions`).

### 1) Add a new permission

1. Create the Permission in DB (use UI or action):
   - UI: Admin → Permissions → Add
   - Or action: `createPermission({ name, key, group?, description? })` in `src/actions/permissions.ts`
2. Keep `key` stable and unique (e.g., `rider.accept_order`). Groups are for UI grouping only.
3. Optionally update `src/config/permissions.ts` if you maintain a curated enum-like list for compile-time usage.

### 2) Assign permission(s) to a role

1. Go to Admin → Roles.
2. Click Assign Permissions (shield icon) on the role.
3. On `/(admin)/[role]/roles/[id]/permissions` page:
   - Permissions are grouped by `group`.
   - Toggle checkboxes and Save.
4. Server actions used: `getRolePermissions`, `assignRolePermissions` in `src/actions/roles.ts`.
   - Implementation resets then connects selected Permission IDs.
   - Role permission changes invalidate relevant permission caches.

### 3) Assign user-level permissions (direct grants)

1. Go to Admin → Users.
2. Click Assign Permissions on a user.
3. On `/(admin)/[role]/users/[id]/permissions` page:
   - You see all permissions grouped; ones inherited from the user’s current role are disabled (read-only); you can grant additional ones to the user via checkbox.
   - Save writes direct user grants (replace strategy).
4. Server actions used: `getUserDirectPermissions`, `setUserDirectPermissions` in `src/actions/user.ts`.
5. Effective permissions for user = role permissions ∪ direct user grants.

Note: If you later decide to hide non-role permissions from this page or add explicit “exclusions”, see the Design Notes section.

### 4) Wire routes to permissions (guarded navigation)

Files:

- `src/config/browser-route.ts` – route strings (including dynamic patterns, e.g., `/admin/roles/[id]/permissions`).
- `src/config/route-list.ts` – route → required permissions mapping (and optional roles), e.g.:
  - `[ROUTES.Admin.Roles]: { permissions: [PERMISSIONS.MANAGE_ROLES] }`
  - `[ROUTES.Admin.RolePermissions]: { permissions: [PERMISSIONS.MANAGE_ROLES] }`

Guard logic:

- `src/helpers/route.ts → hasRouteAccess` resolves exact or dynamic routes and checks:
  - optional role restrictions
  - required permissions (ANY by default; supports ALL)
- `src/components/shared/route-guard.tsx` intercepts navigation and redirects if the user lacks access.

Add a new guarded page:

1. Add the route path to `browser-route.ts`.
2. Add a config entry to `route-list.ts` with required permissions and optional roles.
3. Ensure your page is under the `(admin)/[role]` segment if it’s role-contextual.

### 5) Menus configuration

File: `src/config/menus.ts`

- Each menu item can be associated to a route/permission key.
- The menu should be filtered at render time based on `hasRouteAccess` or a simple permission check.
- When adding a new menu item:
  1. Ensure the route exists in `browser-route.ts` and is configured in `route-list.ts`.
  2. Reference the route in the menu config and, if needed, a permission key from `permissions.ts`.

### 6) Users CRUD (Admin)

- Components: `src/components/pages/admin/users/*`
- Page: `src/app/(admin)/[role]/users/page.tsx`
- Actions: `src/actions/user.ts` → `getUserById`, `createUser`, `updateUser`, `deleteUser`, pagination via `userListWithPagination`.
- Permission assignment for user: `/(admin)/[role]/users/[id]/permissions` (see Section 3).

### 7) Roles CRUD (Admin)

- Components: `src/components/pages/admin/roles/*`
- Page: `src/app/(admin)/[role]/roles/page.tsx`
- Actions: `src/actions/roles.ts` → `createRole`, `updateRole`, `deleteRole`, pagination via `roleListWithPagination`.
- Permission assignment for role: `/(admin)/[role]/roles/[id]/permissions` (see Section 2).

### 8) Permissions CRUD (Admin)

- Components: `src/components/pages/admin/permissions/*`
- Actions: `src/actions/permissions.ts` → `createPermission`, `updatePermission`, `deletePermission`, pagination via `permissionListWithPagination`.

### 9) Caching and invalidation

- `src/services/permissionService.ts` resolves effective permissions and caches per user.
- Invalidation:
  - Role permission changes call `invalidateRolePermissions(roleId)` to drop affected users’ caches.
  - You can also clear all caches via `clearAllPermissionCaches` in `src/actions/permissions.ts`.

### 10) Migrations & generate

- After schema changes: run Prisma migrate and generate.
  - Example (from `my-app`):
    - `npx prisma migrate dev`
    - `npx prisma generate`

### 11) Testing checklist (don’t skip)

- Permission appears in Permissions list and has a unique `key`.
- Role assignment page shows the permission under the expected `group`.
- Assigning to the role reflects in a user with that role.
- User permission page:
  - Inherited (role) permissions appear disabled (cannot be unchecked).
  - Additional direct grants can be toggled and saved.
- Route to the new page is protected correctly (allowed for authorized user; redirected for unauthorized).
- Menu item shows/hides as expected for different users.

### Design Notes / Future Options

- Current model: union-only (no explicit deny). Simple and fast; changes are sparse.
- If you need to visually “unassign” an inherited role permission from a specific user, you need a subtraction mechanism:
  - Option A: add a user-permission-exclusions relation and subtract from role perms.
  - Option B: switch to a single override table with `effect: ALLOW | DENY`.
  - Both approaches are supported by the same guard and resolution flow; choose per business need.
