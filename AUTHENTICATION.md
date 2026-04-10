# Authentication System

## How It Works

### 1. User Registration (`/signup`)

**Flow:**

```
User fills signup form
    ↓
React Hook Form validates (Zod schema)
    ↓
POST /auth/register with email, password, fullName, department, etc.
    ↓
Backend creates user account
    ↓
Redirect to /login (user must log in separately)
```

**Key Files:**

- `components/auth/SignUpForm.tsx` - Form with validation
- `components/auth/SignUpPage.tsx` - Two-column layout
- `lib/api/auth/mutations.ts` - `useSignUp()` hook

**Note:** `passwordConfirm` is validated client-side but NOT sent to backend (client removes it).

### 2. User Login (`/login`)

**Flow:**

```
User enters email + password
    ↓
POST /auth/login
    ↓
Backend returns { access_token, user }
    ↓
Zustand store saves token + user data to state (persisted to localStorage)
    ↓
Redirect to dashboard (/student or /admin)
```

**Key Files:**

- `components/auth/SignInForm.tsx` - Login form
- `lib/api/auth/mutations.ts` - `useSignIn()` hook
- `store/auth/authStore.ts` - Zustand auth store

### 3. App Startup (Auto-Login)

**Flow:**

```
User opens app
    ↓
AuthInitializer component mounts
    ↓
GET /auth/me (with token from localStorage)
    ↓
If success: Zustand updates with user data
    ↓
AuthGuard on protected routes checks isAuthenticated
    ↓
If authenticated: Show dashboard
    ↓
If not: Show login page
```

**Key Files:**

- `contexts/AuthInitializer.tsx` - Runs on app startup
- `lib/api/auth/queries.ts` - `useCurrentUser()` hook
- `components/auth/AuthGuard.tsx` - Route protection

### 4. API Request Flow

**Every request includes auth token:**

```
1. Component calls useSignIn() / useSignUp()
2. Mutation sends request to apiClient
3. apiClient interceptor reads token from Zustand store
4. Header added: Authorization: Bearer <token>
5. Backend validates token & processes request
6. Response returned & validated with TypeScript types
```

**Key Files:**

- `lib/api/client.ts` - Axios instance + interceptors
- `lib/api/auth/types.ts` - TypeScript response types (NO Zod validation)

## Architecture Decisions

### Why TypeScript types instead of Zod for API responses?

- **API is trusted:** Backend validates all data before sending
- **Simpler:** TypeScript inference + IDE autocomplete
- **Zod for user input only:** Sign-up, sign-in forms validated with Zod
- **Response shapes are stable:** Backend guarantees contract

### Why Zustand + localStorage?

- **Lightweight:** No provider hell, minimal boilerplate
- **Persistent:** Auth survives page reloads
- **Reactive:** Components re-render when auth state changes
- **Easy to extend:** Add more fields as needed

### Why separate signup from auto-login?

- **UX clarity:** User immediately knows if registration succeeded
- **Backend flexibility:** Backend can require email verification later
- **Security:** Separate endpoints for registration vs authentication

## Token Management

### Where token is stored

1. **Zustand state:** `useAuthStore.getState().access_token`
2. **localStorage:** Via Zustand persist middleware (key: `auth-store`)

### How token is used

- Automatically added to all API requests via axios interceptor
- Read from Zustand on each request (always fresh)
- Cleared on logout

### If token expires

- Backend returns 401 Unauthorized
- Currently: User sees error (future: implement refresh token flow)
- Recommendation: Add refresh token endpoint later

## Future: Permission System

### Current State

- Role-based (user.roles array)
- Routes protected by `AuthGuard`
- Sidebar filtered by role

### Planned Implementation

When permissions are needed:

1. **Permission types:** Define granular permissions

   ```typescript
   type Permission = 'create_proposal' | 'review_proposal' | 'manage_users' | ...
   ```

2. **Store in auth response:**

   ```typescript
   user: {
     id: string,
     email: string,
     roles: ['STUDENT'],
     permissions: ['create_proposal', 'submit_for_review'],
     ...
   }
   ```

3. **Check in components:**

   ```typescript
   const { user } = useAuthStore();
   if (!user.permissions.includes('delete_project')) {
     return <div>Access denied</div>;
   }
   ```

4. **Update AuthGuard:**
   ```typescript
   <AuthGuard requiredPermissions={['manage_users']}>
     <AdminPanel />
   </AuthGuard>
   ```

## Debugging Auth Issues

### Check what's stored

```typescript
// In browser console
const { access_token, user } = useAuthStore.getState();
console.log(access_token, user);

// Check localStorage
JSON.parse(localStorage.getItem("auth-store"));
```

### Check network requests

- Network tab → look for `Authorization` header
- Should be: `Authorization: Bearer <token>`

### Check auth state updates

- React DevTools → Zustand
- Watch for `login()` and `logout()` actions

### Common issues

| Issue                       | Cause                      | Fix                   |
| --------------------------- | -------------------------- | --------------------- |
| Token not in header         | Zustand not initialized    | Hard refresh page     |
| Unauthorized 401            | Token expired              | Re-login              |
| GET /auth/me fails silently | API endpoint doesn't exist | Check backend         |
| User stuck on loading       | AuthInitializer unfinished | Wait or check network |

## Testing Auth Flow

### Manual Testing Checklist

- [ ] Sign up with new email
- [ ] Sign in with credentials
- [ ] Hard refresh page - should stay logged in
- [ ] Click logout - redirects to login
- [ ] Try accessing `/admin` without login - redirects to `/login`
- [ ] Check browser DevTools → Network → see Authorization header
- [ ] Check localStorage → auth-store should have token & user

## File Structure Summary

```
Auth Flow:
  signup → /auth/register → signin redirected
  signin → /auth/login → dashboard
  app startup → GET /auth/me → restore session

Code Files:
  types/auth.ts                    # Type definitions
  lib/api/auth/mutations.ts        # useSignUp(), useSignIn()
  lib/api/auth/queries.ts          # useCurrentUser()
  store/auth/authStore.ts          # Global auth state
  components/auth/SignUpForm.tsx   # Signup form
  components/auth/SignInForm.tsx   # Login form
  components/auth/AuthGuard.tsx    # Route protection
  contexts/AuthInitializer.tsx     # Startup check
  lib/api/client.ts                # Token injection
```
