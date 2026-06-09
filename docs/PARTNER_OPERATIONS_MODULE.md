# Partner Operations Module — Technical Documentation

## 1. System Overview

The **Partner Operations Module** is a core sub-system of the Good Energy Admin Platform. It provides a cohesive operational framework for managing B2B Partner engagement, tracking performance objectives, and assigning granular execution steps.

The module operates on a strict hierarchy:
*   **PartnerProfile**: The root identity for the operational workspace.
*   **PartnerGoal (Objetivo)**: High-level objectives with numeric targets and deadlines.
*   **Milestone (Hito)**: Strategic checkpoints. Can be standalone or explicitly linked to a Goal.
*   **PartnerTask (Tarea)**: Atomic execution items. Can be standalone, linked to a Goal, or linked to a Milestone.

---

## 2. Database Schema (Prisma)

The data model uses PostgreSQL (Supabase) via Prisma. The primary relationships enforce a clear chain of command and data isolation.

### `PartnerProfile`
*   **`userId`**: Maps to the internal `User.id` (which links to `clerkUserId`).
*   **Relations**: `1-to-many` with `PartnerGoal`, `Milestone`, and `PartnerTask`.

### `PartnerGoal`
*   **Fields**: `targetMetric` (string), `currentProgress` (float), `targetValue` (float), `status` (enum string), `deadline` (DateTime).
*   **Status Constraints**: `NOT_STARTED`, `IN_PROGRESS`, `ACHIEVED`, `AT_RISK`.
*   **Relations**: `1-to-many` with `Milestone` and `PartnerTask`.

### `Milestone`
*   **Fields**: `isCompleted` (boolean), `dueDate` (DateTime).
*   **Relations**: Can optionally link upward to `PartnerGoal` (`goalId`). Has a `1-to-many` relation downwards to `PartnerTask`.

### `PartnerTask`
*   **Fields**: `status` (BACKLOG, TODO, IN_PROGRESS, REVIEW, DONE), `priority` (LOW, MEDIUM, HIGH, CRITICAL).
*   **Foreign Keys**:
    *   `partnerProfileId` (Required): Anchors the task to a specific partner.
    *   `goalId` (Optional): Upward link to a broader objective.
    *   `milestoneId` (Optional): Upward link to a specific strategic checkpoint.
    *   `assignedBy` (Required): Tracks the `SUPER_ADMIN` clerkUserId who delegated the work.

---

## 3. Role-Based Access Control (RBAC)

Authentication and authorization are managed via **Clerk**. Permissions evaluate the custom claim `metadata.role`.

1.  **SUPER_ADMIN**:
    *   **Scope**: Global.
    *   **Capabilities**: Full CRUD access across all Partner Profiles. Can create profiles, set goals, assign tasks, and override statuses.
    *   **Views**: `/admin/partners` (Master overview of all partners).
2.  **PARTNER**:
    *   **Scope**: Isolated to self.
    *   **Capabilities**: Can view assigned goals, check off milestones, move task statuses (Kanban), and update goal progress integers.
    *   **Views**: `/admin/mi-gestion` (Isolated workspace).

*Security Guard Logic*: The `assertPartnerOrAdmin()` and `assertSuperAdmin()` guards in `actions.ts` strictly enforce these boundaries server-side before any database transaction.

---

## 4. Server Actions (Endpoints & Logic)

The logic resides in `app/admin/partners/actions.ts` utilizing React Server Actions.

### Master Retrieval
*   `getAllPartnerProfilesAction()`:
    *   **Access**: `SUPER_ADMIN`
    *   **Returns**: Flat array of all partners with nested `goals`, `milestones`, and `tasks` (sorted by creation date).

### Creation (Mutations)
*   `createPartnerGoalAction(input: CreateGoalInput)`
*   `createPartnerTaskAction(input: CreateTaskInput)`
    *   Accepts `goalId` and `milestoneId` to enforce relations on creation.
*   `addMilestoneAction(input: AddMilestoneInput)`

### Partner Self-Service Operations
*   `getMyPartnerWorkspaceAction()`:
    *   **Logic**: Resolves the internal `User` ID from Clerk's `userId`. Finds the unique `PartnerProfile` and hydrates the workspace data. (If called by a `SUPER_ADMIN` from the partner preview route, it mocks the view by loading the first active partner profile).
*   `updateTaskStatusAction(taskId, newStatus)`:
    *   **Security Check**: Verifies that the task belongs to the `PartnerProfile` of the caller before updating.
*   `updateGoalProgressAction(goalId, newProgress)`:
    *   **Logic**: Automatically recalculates the `status` string (`ACHIEVED`, `IN_PROGRESS`) based on the `newProgress` vs `targetValue`.

---

## 5. Front-End Visualization

### The Timeline Engine (`Línea de Tiempo`)
Implemented dynamically in both `PartnersMasterClient` and `PartnerWorkspaceClient`.
*   **Logic**: Parses `goals`, `milestones`, and `tasks`. Filters out entities without a deadline/dueDate. Maps them to a generic `TimelineItem` type.
*   **Sorting**: Runs `Array.prototype.sort()` based on Unix timestamps to create an interleaved chronological feed.
*   **UI Strategy**: Uses pseudo-elements (`::before`) to draw the continuous vertical spine, nesting custom SVGs inside circular badges.

### Kanban Tracking
Tasks are rendered via standard mapping, utilizing badge coloring for visual grouping (e.g., Yellow for High Priority, Blue for In Progress). Tasks feature relational pill-tags indicating their association with a broader Goal or Milestone.

---

## 6. Development Opportunities & Future Gaps

1.  **Granular Notifications (Webhooks)**: Currently, assigning a task silently adds it to the DB. Integrating Resend (email) or Novu (in-app) when a `SUPER_ADMIN` assigns a CRITICAL task would improve operations.
2.  **Drag-and-Drop Kanban**: `PartnerWorkspaceClient.tsx` uses a grid with dropdowns for status changes. Implementing `@hello-pangea/dnd` for fluid drag-and-drop column transitions would boost UX significantly.
3.  **Task Dependencies**: Adding a `parentTaskId` to `PartnerTask` would allow blocking tasks until a prerequisite is resolved.
4.  **Automated Goal Tracking**: Instead of partners manually updating `currentProgress` on Goals, backend webhooks tied to real investments/sales could auto-increment `currentProgress`.
5.  **Audit Logging**: Creating an `ActivityLog` table to track *who* moved a task status and *when* for enterprise-grade accountability.
