# Good Energy Admin — Technical Architecture

> Last updated: 2026-05-27  
> Commit: `8a0382b` — `feat(admin): Clerk RBAC + Partner Operations Module`

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Authentication & RBAC](#2-authentication--rbac)
3. [Clerk Webhook Lifecycle](#3-clerk-webhook-lifecycle)
4. [Database Schema](#4-database-schema)
5. [Server Action Architecture](#5-server-action-architecture)
6. [Partner Operations Module](#6-partner-operations-module)
7. [Frontend Routes & Components](#7-frontend-routes--components)
8. [Toast & UX Feedback System](#8-toast--ux-feedback-system)
9. [Middleware & Route Protection](#9-middleware--route-protection)
10. [File Map](#10-file-map)
11. [Environment Variables](#11-environment-variables)
12. [Remaining Manual Steps](#12-remaining-manual-steps)

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Auth | Clerk (`@clerk/nextjs` v7) |
| Database | SQLite via Prisma ORM v6 |
| Styling | Tailwind CSS (custom Good Energy palette) |
| Toast Notifications | Sonner |
| Webhook Verification | Svix |
| Icons | Lucide React |
| State | React `useTransition`, `useOptimistic` |

**Prisma client output path:** `app/generated/prisma`  
**Prisma singleton:** `lib/prisma.ts`

---

## 2. Authentication & RBAC

### Role Hierarchy

```
SUPER_ADMIN  ─── Full platform control, user management, partner oversight
    │
  PARTNER    ─── Operational workspace, task/goal management (own data only)
    │
 INVESTOR    ─── Default role auto-assigned on sign-up via webhook
    │
   USER      ─── Fallback / unauthenticated state
```

Roles are stored in **Clerk `publicMetadata.role`** (string). They are read server-side via `auth().sessionClaims.metadata.role` (zero round-trips, embedded in the JWT) and client-side via `useUser().user.publicMetadata.role` through `AuthContext`.

### Guards

| Layer | Mechanism |
|---|---|
| Middleware | `clerkMiddleware` in `middleware.ts` — blocks unauthenticated access to all `/admin/*` routes, redirects to `/sign-in` |
| Server Components | `auth()` call at page level — reads `sessionClaims`, renders `<AccessDenied />` or redirects without client JS running |
| Server Actions | `assertSuperAdmin()` / `assertPartnerOrAdmin()` helpers — throw `403` before any DB operation |
| Client Components | `useRBAC()` hook — `isSuperAdmin`, `isPartner` flags for conditional UI rendering |

### Key Files

- `middleware.ts` — route-level auth gate
- `contexts/AuthContext.tsx` — provides `AdminUser` + `UserRole` types, reads Clerk `useUser()`
- `hooks/useRBAC.ts` — boolean permission flags consumed by client components
- `components/wrapper/AuthWrapper.tsx` — conditionally wraps app in `<ClerkProvider>` based on `config.auth.enabled`

---

## 3. Clerk Webhook Lifecycle

**Endpoint:** `POST /api/webhooks/clerk`  
**File:** `app/api/webhooks/clerk/route.ts`

### Flow on `user.created`

```
Clerk  ──POST /api/webhooks/clerk──►  svix.verify(headers, rawBody, CLERK_WEBHOOK_SECRET)
                                             │ invalid → 400
                                             ▼
                                     event.type === 'user.created'
                                             │
                                   clerkClient.users.updateUserMetadata(id, {
                                     publicMetadata: { role: 'INVESTOR' }
                                   })
                                             │
                                   prisma.user.upsert({
                                     where: { clerkUserId: id },
                                     create: { clerkUserId, name, email, ... },
                                     update: { name, email, ... }
                                   })
                                             │
                                          200 OK
```

**Why svix?** Clerk signs webhook payloads. Svix verifies the `svix-id`, `svix-timestamp`, and `svix-signature` headers against your `CLERK_WEBHOOK_SECRET`, preventing spoofed events.

**Why upsert?** Guarantees idempotency — replaying events or retries won't create duplicate rows.

---

## 4. Database Schema

### Entity Relationship Overview

```
User ─────────────────────── PartnerProfile (1:1, optional)
 │                                 │
 ├── Investment (1:N)              ├── PartnerGoal (1:N)
 └── Earning (1:N)                 │     └── Milestone (1:N, optional goalId)
                                   ├── Milestone (1:N, direct)
                                   └── PartnerTask (1:N)
```

### Model Details

#### `User`
```prisma
model User {
  id             String          @id @default(cuid())
  clerkUserId    String?         @unique   // Clerk user_xxx ID, set by webhook
  name           String
  email          String          @unique
  phone          String?
  country        String?
  avatar         String?
  isActive       Boolean         @default(true)
  investments    Investment[]
  earnings       Earning[]
  partnerProfile PartnerProfile?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}
```
> `clerkUserId` is the bridge between Clerk's auth world and the local DB. It is written by the `user.created` webhook and used in every server action that needs to resolve a Prisma `userId` from an authenticated session.

#### `PartnerProfile`
```prisma
model PartnerProfile {
  id          String   @id @default(cuid())
  userId      String   @unique              // FK → User.id
  displayName String                        // Auto-derived on promotion
  bio         String?
  isActive    Boolean  @default(true)       // Soft-delete flag
  goals       PartnerGoal[]
  milestones  Milestone[]
  tasks       PartnerTask[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
> `isActive` is the demotion switch. Setting it `false` blocks workspace access while preserving all goals/tasks/milestones for audit purposes.

#### `PartnerGoal`
| Field | Type | Notes |
|---|---|---|
| `status` | `String` | `NOT_STARTED` \| `IN_PROGRESS` \| `ACHIEVED` \| `AT_RISK` |
| `currentProgress` | `Float` | Auto-updated by `updateGoalProgressAction` |
| `targetValue` | `Float` | Quantitative metric ceiling |
| `targetMetric` | `String` | Human label (e.g. "Inversiones COP") |
| `deadline` | `DateTime?` | Optional hard date |

#### `Milestone`
| Field | Type | Notes |
|---|---|---|
| `goalId` | `String?` | Optional link to a `PartnerGoal` |
| `isCompleted` | `Boolean` | Toggled by `toggleMilestoneAction` |
| `completedAt` | `DateTime?` | Set to `now()` on completion, `null` on uncheck |

#### `PartnerTask`
| Field | Type | Notes |
|---|---|---|
| `status` | `String` | `BACKLOG` \| `TODO` \| `IN_PROGRESS` \| `REVIEW` \| `DONE` |
| `priority` | `String` | `LOW` \| `MEDIUM` \| `HIGH` \| `CRITICAL` |
| `assignedBy` | `String` | Clerk `userId` of the SUPER_ADMIN who created the task — audit trail |

---

## 5. Server Action Architecture

All server actions live in two files:

### `app/actions/users.ts` — User/Role management

| Action | Auth Guard | Description |
|---|---|---|
| `getUsersAction(limit, offset)` | SUPER_ADMIN | Fetches Clerk user list, maps to `ClerkUserRow[]` |
| `updateUserRoleAction(clerkUserId, newRole)` | SUPER_ADMIN | Unified atomic lifecycle (see below) |

#### `updateUserRoleAction` — Atomic Lifecycle

```
assertSuperAdmin()
    │
clerkClient.getUser(targetClerkUserId)   ← read previousRole from publicMetadata
    │
clerkClient.updateUserMetadata(...)       ← Clerk updated FIRST (auth source of truth)
    │
prisma.$transaction(async tx => {
    │
    user = tx.user.findUnique({ clerkUserId })
    │ no user → warn + no-op (webhook will sync)
    │
    ├─ newRole === 'PARTNER'
    │    existing = tx.partnerProfile.findUnique({ userId })
    │    ├─ exists & isActive=false  → update isActive=true   (re-activation)
    │    ├─ exists & isActive=true   → no-op                   (idempotent)
    │    └─ not exists               → create with displayName (provisioning)
    │
    └─ previousRole === 'PARTNER' && newRole !== 'PARTNER'
         existing = tx.partnerProfile.findUnique({ userId })
         └─ exists → update isActive=false                     (soft-deactivation)
})
    │
revalidatePath × 3 (/admin/usuarios, /admin/partners, /admin/mi-gestion)
```

**Failure resilience:** The `prisma.$transaction` is wrapped in its own `try/catch`. If the DB write fails after Clerk was already updated, the role change still succeeds from the auth perspective. The error is logged server-side but not surfaced as a user-facing failure. This prevents a confusing partial-failure state where the UI shows an error but the user's role actually changed.

---

### `app/admin/partners/actions.ts` — Partner Operations

#### SUPER_ADMIN only

| Action | Description |
|---|---|
| `getAllPartnerProfilesAction()` | Returns all profiles (active + inactive) with nested goals/milestones/tasks |
| `createPartnerProfileAction(userId, displayName, bio?)` | Manual profile creation |
| `createPartnerGoalAction(input)` | Creates goal on a specified profile |
| `createPartnerTaskAction(input)` | Creates task; sets `assignedBy` = actor's clerkUserId |
| `addMilestoneAction(input)` | Creates milestone, optionally linked to a goal |
| `deleteOperationalItemAction(id, type)` | Hard deletes goal / task / milestone |
| `updateGoalStatusAction(goalId, status)` | Manual status override |

#### PARTNER or SUPER_ADMIN

| Action | Ownership Check | Description |
|---|---|---|
| `getMyPartnerWorkspaceAction()` | PARTNER: own profile only; blocks if `isActive=false` | Returns full profile tree |
| `updateTaskStatusAction(taskId, newStatus)` | Verifies `task.partnerProfileId === profile.id` | Moves task between statuses |
| `toggleMilestoneAction(milestoneId, isCompleted)` | Verifies `milestone.partnerProfileId === profile.id` | Checks/unchecks milestone |
| `updateGoalProgressAction(goalId, newProgress)` | Verifies `goal.partnerProfileId === profile.id` | Updates `currentProgress`, auto-derives `status` |

#### `updateGoalProgressAction` — Status Auto-derivation

```
progress >= targetValue  →  status = ACHIEVED
progress > 0             →  status = IN_PROGRESS
progress === 0           →  status = NOT_STARTED
```

---

## 6. Partner Operations Module

### Provisioning Lifecycle

```
User signs up
    └─ webhook assigns role = INVESTOR

SUPER_ADMIN promotes → PARTNER
    └─ updateUserRoleAction fires
         └─ PartnerProfile created automatically (isActive=true)
              └─ Partner accesses /admin/mi-gestion ✓

SUPER_ADMIN demotes → INVESTOR/USER
    └─ updateUserRoleAction fires
         └─ PartnerProfile.isActive = false
              └─ Partner hits /admin/mi-gestion
                   └─ getMyPartnerWorkspaceAction returns error
                        └─ <NoProfile> rendered (data preserved)

SUPER_ADMIN promotes back → PARTNER
    └─ updateUserRoleAction fires
         └─ PartnerProfile.isActive = true (re-activated, all data intact)
              └─ Partner accesses /admin/mi-gestion ✓
```

### Data Access Boundaries

| Actor | Can See | Can Modify |
|---|---|---|
| SUPER_ADMIN | All profiles, all tasks, all goals | Create/delete any item; update any status |
| PARTNER | Own profile only | Update own task statuses, toggle own milestones, update own goal progress |
| INVESTOR / USER | Nothing | Nothing |

---

## 7. Frontend Routes & Components

### `/admin/partners` — Master Dashboard (SUPER_ADMIN)

**Server component** (`page.tsx`):
- `auth()` → role check → `<AccessDenied />` if not SUPER_ADMIN
- Fetches `getAllPartnerProfilesAction()` + `getUsersAction()` in parallel
- Passes `initialProfiles` and `partnerClerkUsers` to client

**Client component** (`PartnersMasterClient.tsx`):
- **Stats bar:** active partners, goal completion %, total tasks, completed milestones
- **3-tab view:**
  - *Resumen:* collapsible `PartnerCard` per profile showing goals with progress bars, task list with badges, milestone checklist
  - *Tareas:* sortable/filterable table (by partner, status, priority)
  - *Objetivos:* goal cards with progress bars and status badges
- **Creation modals:** `CreateGoalModal`, `CreateTaskModal`, `AddMilestoneModal` — each uses `useTransition` + `sonner` loading/success/error toasts
- **Delete controls** on each goal/task row (optimistic local state update + server action)

### `/admin/mi-gestion` — Partner Workspace (PARTNER + SUPER_ADMIN)

**Server component** (`page.tsx`):
- `auth()` → role check → `<AccessDenied />` if not PARTNER/SUPER_ADMIN
- Calls `getMyPartnerWorkspaceAction()` → `<NoProfile />` if inactive/absent
- Passes `profile`, `currentUserId`, `isSuperAdmin` to client

**Client component** (`PartnerWorkspaceClient.tsx`):

| Section | Component | Interactivity |
|---|---|---|
| Goals | Progress bars per goal | `GoalProgressInput` — inline numeric edit, Enter to submit |
| Goal Milestones | Nested under each goal | `MilestoneRow` — `useOptimistic` checkbox toggle |
| General Milestones | Standalone milestones | Same `MilestoneRow` |
| Tasks | Grid of `TaskCard` | `TaskStatusDropdown` — `useTransition` dropdown |
| Task Filter | Status pill buttons | Client-side filter, no re-fetch |
| Overall Progress | Footer progress bar | Derived from `doneTasks / totalTasks` |

### `/admin/usuarios` — User Management (SUPER_ADMIN)

- Server page fetches Clerk users, renders `UserManagementClient`
- `UserManagementClient`: search input, role filter, per-row `RoleDropdown`
- Role changes call `updateUserRoleAction` — automatically triggers PartnerProfile lifecycle

---

## 8. Toast & UX Feedback System

**Provider:** `<Toaster>` in `app/layout.tsx` — global, position `bottom-right`, dark theme matching Good Energy palette (`bg: #0A3A43`, `border: rgba(26,107,120,0.5)`, `color: #FFFDF0`).

| Trigger | Toast |
|---|---|
| New user sign-up redirect | `WelcomeToast` — fires on `?welcome=1`, then cleans URL param |
| Role update | Loading → success/error from `UserManagementClient` |
| Task status change | `"Tarea movida a [status]"` or `"¡Tarea completada! 🎉"` |
| Milestone toggle | `"¡Hito completado! 🎉"` or `"Hito desmarcado"` |
| Goal progress update | `"¡Objetivo alcanzado! 🎯"` or `"Progreso actualizado a X%"` |
| Goal/task/milestone creation | Loading → success/error from modals |
| Delete | Loading → success/error |

**Pattern:** All mutations use `toast.loading(id)` → `toast.success({ id })` / `toast.error({ id })` to replace the loading indicator in-place.

---

## 9. Middleware & Route Protection

```typescript
// middleware.ts
export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !userId) {
    // → redirect to /sign-in?redirect_url=<original>
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
```

The middleware is the **first** line of defense. All role-specific restrictions inside `/admin` are a second layer enforced by server components and server actions independently.

---

## 10. File Map

```
app/
├── (auth)/
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx       ← fallbackRedirectUrl=/admin?welcome=1
├── actions/
│   └── users.ts                               ← getUsersAction, updateUserRoleAction
├── admin/
│   ├── layout.tsx                             ← force-dynamic wrapper
│   ├── AdminLayoutClient.tsx                  ← sidebar nav, role-filtered links
│   ├── page.tsx                               ← dashboard + WelcomeToast
│   ├── partners/
│   │   ├── page.tsx                           ← SUPER_ADMIN guard (server)
│   │   ├── PartnersMasterClient.tsx           ← master dashboard UI
│   │   └── actions.ts                         ← all partner server actions
│   ├── mi-gestion/
│   │   ├── page.tsx                           ← PARTNER+SA guard (server)
│   │   └── PartnerWorkspaceClient.tsx         ← partner self-service UI
│   └── usuarios/
│       ├── page.tsx                           ← SUPER_ADMIN guard (server)
│       └── UserManagementClient.tsx           ← Clerk user table + role dropdowns
├── api/
│   └── webhooks/clerk/route.ts               ← svix-verified user.created handler
├── generated/prisma/                          ← generated Prisma client (gitignored)
└── layout.tsx                                 ← <Toaster> global provider

components/
├── WelcomeToast.tsx                           ← fires on ?welcome=1
└── wrapper/AuthWrapper.tsx                    ← conditional ClerkProvider

contexts/AuthContext.tsx                       ← AdminUser type, role normalization
hooks/useRBAC.ts                               ← isSuperAdmin, isPartner, etc.
lib/prisma.ts                                  ← singleton PrismaClient
middleware.ts                                  ← Clerk auth middleware

prisma/
├── schema.prisma                              ← full schema
└── dev.db                                     ← SQLite database
```

---

## 11. Environment Variables

All variables required in `.env.local`:

```bash
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk sign-in/up redirect config
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin?welcome=1

# Clerk Webhook (from Dashboard → Webhooks → signing secret)
CLERK_WEBHOOK_SECRET=whsec_...

# Prisma / SQLite
DATABASE_URL="file:./dev.db"
```

---

## 12. Remaining Manual Steps

> Steps you must complete on your end before the system is fully operational in production.

### Step 1 — Set environment variables in production

Ensure all variables from [Section 11](#11-environment-variables) are set in your deployment environment (Vercel, Railway, etc.). **`CLERK_WEBHOOK_SECRET` is the most critical new addition.**

### Step 2 — Register the Clerk Webhook

1. Open [Clerk Dashboard](https://dashboard.clerk.com) → your application
2. Navigate to **Webhooks** → **Add Endpoint**
3. Set URL: `https://your-production-domain.com/api/webhooks/clerk`
4. Subscribe to event: ✅ `user.created`
5. Copy the **Signing Secret** → paste as `CLERK_WEBHOOK_SECRET` in your env

For **local development**, use the Clerk CLI to forward events:
```bash
npx clerk webhooks forward --url http://localhost:3000/api/webhooks/clerk
```

### Step 3 — Set your own Clerk account as SUPER_ADMIN

Newly created accounts get `INVESTOR` by default. To bootstrap the first admin:

1. Sign up normally at `/sign-up`
2. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Users → your user
3. Under **Public metadata**, set:
   ```json
   { "role": "SUPER_ADMIN" }
   ```
4. Sign out and back in to refresh the JWT claims

After this, you can manage all other roles from `/admin/usuarios`.

### Step 4 — Provision PartnerProfiles for existing PARTNER users

If you have users who were already assigned the `PARTNER` role before this implementation, they won't have a `PartnerProfile` record yet (the auto-provisioning only runs on future `updateUserRoleAction` calls). To backfill them:

1. From `/admin/usuarios`, find each PARTNER user
2. Set their role to `INVESTOR` (saves) → then set it back to `PARTNER`
3. This round-trips through `updateUserRoleAction`, which auto-provisions the profile

Alternatively, run a one-time Prisma script to create profiles for all users whose `clerkUserId` has `publicMetadata.role = "PARTNER"` in Clerk.

### Step 5 — Run database migration in production

The `dev.db` SQLite file is for local development only. In production:

- **If using SQLite in production:** ensure the DB file path is persistent (not ephemeral storage) and run:
  ```bash
  npx prisma db push
  ```
- **If migrating to PostgreSQL/MySQL:** update `datasource db` in `schema.prisma`, update `DATABASE_URL`, and run:
  ```bash
  npx prisma migrate deploy
  ```

### Step 6 — (Optional) Restrict Clerk session token claims

For `sessionClaims.metadata.role` to be available server-side without extra API calls, add a **JWT template** or **session customization** in Clerk Dashboard:

1. Clerk Dashboard → **Sessions** → **Edit** session token
2. Add to the token:
   ```json
   {
     "metadata": "{{user.public_metadata}}"
   }
   ```

This is already expected by `assertSuperAdmin()` and `assertPartnerOrAdmin()`. Without it, the role check falls back to `undefined` and all SUPER_ADMIN actions will be rejected.

---

*Architecture documentation maintained in `docs/ARCHITECTURE.md`.*
