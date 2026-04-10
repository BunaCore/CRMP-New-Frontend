# CRMP New Frontend (Permission-Based Dashboard)

This repository is the **frontend** for the Collaborative Research Management Platform (CRMP).
It implements **permission-based access control (PBAC)**: the backend supplies a user’s permissions, and the UI + route guards render only what the user is allowed to access.

## Permission Model (PBAC)

- The backend returns `permissions: string[]` for the authenticated user.
- The frontend normalizes permissions defensively and checks them against the canonical set in:
  - `src/access-control/permission-gates.tsx`
- UI elements are gated via:
  - `<Can permission="PROJECT_CREATE">...</Can>`
  - `<RequiresPermissions permissions={[...]} mode="any">...</RequiresPermissions>` (OR semantics)

## Auth & Cookie Flow

Client-side auth uses:

- Zustand for persisted session state (`src/stores/authStore.ts`)
- Cookies for server/edge-friendly presence + permission caching:
  - `access_token`
  - `user_permissions` (JSON-encoded permissions array)

Key pieces:

- `src/components/auth/SignInForm.tsx` sets `access_token` + `user_permissions` after login.
- `src/context/AuthInitializer.tsx` validates the session and re-syncs cookies.
- Middleware is intentionally minimal and only checks token presence (not authorization).
- Route guards enforce authorization in the client with loading-safe behavior:
  - `src/access-control/DashboardPermissionGuard.tsx`
  - `src/access-control/AdminPermissionGuard.tsx`

## Navigation & Sidebar Filtering

Sidebars are filtered using config-driven permission rules (no role checks).

- Dashboard (PI space): `src/access-control/sidebar-permission-config.ts`
- Admin sidebar authorization:
  - `src/navigation/sidebar/admin-nav-config.ts`

The app treats:

- `PROJECT_CREATE`-capable users as PI space users (`/dashboard`)
- users without `PROJECT_CREATE` as admin space users (`/admin`)

When a user hits an unauthorized section:

- the app shows the `404`-style access denied UI
- then redirects to the appropriate area (or `/login` if history is unavailable)

## Local Development

### Requirements

- Node.js 20+
- npm

### Install & Run

```bash
npm ci
npm run dev
```

Open the app at `http://localhost:3000` (default Next.js behavior).

### Build & Lint

```bash
npm run lint
npm run build
```

### Environment Variables

`src/lib/api/client.ts` uses:

- `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:3001` if not set)

Example:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Mock Login (Development Only)

Mock login responses are available in:

- `src/data/mock-auth.ts`

Example emails:

- `pi@crmp.edu`
- `rad@crmp.edu`
- `finance@crmp.edu`
- `coordinator@crmp.edu`

## CI (Pull Requests)

GitHub Actions checks are defined in:

- `.github/workflows/prchecker.yml`

The workflow runs:

- `npm run lint` (Biome)
- `npm run build` (Next.js)

## Notes on Permission Staleness

Permissions are cached in cookies (`user_permissions`).
If permissions change on the backend, users may need to clear cookies or re-login for the UI to reflect updated permissions.

# Next.js Admin Template with TypeScript & Shadcn UI

**Studio Admin** - Includes multiple dashboards, authentication layouts, customizable theme presets, and more.

<img src="https://github.com/arhamkhnz/next-shadcn-admin-dashboard/blob/main/media/dashboard.png?version=5" alt="Dashboard Screenshot">

We built this as a cleaner alternative with features often missing in others, such as theme toggling and layout controls, while keeping the design modern, minimal, and flexible.

> [!TIP]
> I’m also working on Nuxt.js, Svelte, and React (Vite + TanStack Router) versions of this dashboard. They’ll be live soon.

## Features

- Built with Next.js 16, TypeScript, Tailwind CSS v4, and Shadcn UI
- Responsive and mobile-friendly
- Customizable theme presets (light/dark modes with color schemes like Tangerine, Brutalist, and more)
- Flexible layouts (collapsible sidebar, variable content widths)
- Authentication flows and screens
- Prebuilt dashboards (Default, CRM, Finance) with more coming soon
- Role-Based Access Control (RBAC) with config-driven UI and multi-tenant support _(planned)_

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Validation**: Zod
- **Forms & State Management**: React Hook Form, Zustand
- **Tables & Data Handling**: TanStack Table
- **Tooling & DX**: Biome, Husky

## Screens

### Available

- Default Dashboard
- CRM Dashboard
- Finance Dashboard
- Authentication (4 screens)

### Coming Soon

- Analytics Dashboard
- eCommerce Dashboard
- Academy Dashboard
- Logistics Dashboard
- Email Page
- Chat Page
- Calendar Page
- Kanban Board
- Invoice Page
- Users Management
- Roles Management

## Colocation File System Architecture

This project follows a **colocation-based architecture** each feature keeps its own pages, components, and logic inside its route folder.  
Shared UI, hooks, and configuration live at the top level, making the codebase modular, scalable, and easier to maintain as the app grows.

For a full breakdown of the structure with examples, see the [Next Colocation Template](https://github.com/arhamkhnz/next-colocation-template).

## Getting Started

You can run this project locally, or deploy it instantly with Vercel.

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farhamkhnz%2Fnext-shadcn-admin-dashboard)

_Deploy your own copy with one click._

### Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git
   ```
2. **Navigate into the project**
   ```bash
    cd next-shadcn-admin-dashboard
   ```
3. **Install dependencies**

   ```bash
    npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

### Formatting and Linting

Format, lint, and organize imports

```bash
npx @biomejs/biome check --write
```

> For more information on available rules, fixes, and CLI options, refer to the [Biome documentation](https://biomejs.dev/).

---

> [!IMPORTANT]  
> This project is updated frequently. If you’re working from a fork or an older clone, pull the latest changes before syncing. Some updates may include breaking changes.

---

Contributions are welcome. Feel free to open issues, feature requests, or start a discussion.

**Happy Vibe Coding!**
