Here is Claude's plan:  
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Plan: Persist Login State Locally (Task 001)

Context

The auth store (src/stores/useAuthStore.ts) holds user state in-memory only. Every page  
 reload logs the user out, forcing re-login. The task is to persist the session to  
 localStorage via a Pinia persistence plugin so auth state survives reloads, while keeping
all existing behavior (mock data, no real API validation).

---

Approach

Install pinia-plugin-persistedstate and register it on the Pinia instance in main.ts.
Declare persistence on the auth store via the third defineStore argument. The plugin reads
from localStorage synchronously during store hydration, so the router beforeEach guard
sees the correct isLoggedIn value immediately on page load — no changes to the router or
views needed.

Storage key: otakuflow:user. Only user is persisted (pick: ['user']); computed isLoggedIn
is excluded.

New dependency is recorded in the run log per R8.

---

Files to Modify

1.  package.json (new dependency)

pnpm add pinia-plugin-persistedstate

Reason recorded in run log (R8): provides Pinia-native persistence without re-implementing
$subscribe + localStorage boilerplate.

2.  src/main.ts

Register the plugin on the Pinia instance before mounting:

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

3.  src/stores/useAuthStore.ts

- Fix store ID from '' to 'auth'
- Add persist config as third argument to defineStore
- Keep user as a plain ref<User> — the plugin hydrates it on startup

export const useAuthStore = defineStore(
'auth',
() => {
const user = ref<User>(null)
const isLoggedIn = computed(() => user.value !== null)
const login = (username: string) => { user.value = { username } }
const logout = () => { user.value = null }
return { user, isLoggedIn, login, logout }
},
{
persist: {
key: 'otakuflow:user',
pick: ['user'],
},
},
)

4.  src/**tests**/useAuthStore.spec.ts (new file)

Unit tests validating the PRD acceptance criteria:

┌────────────────────────────┬────────────────────────────────────────────────────────┐
│ Criterion │ Test │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Starts logged out │ isLoggedIn is false with empty localStorage │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Login persists to │ After login(), localStorage['otakuflow:user'] contains │
│ localStorage │ user │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ State restored on re-init │ Pre-seed localStorage → fresh store → isLoggedIn true │
├────────────────────────────┼────────────────────────────────────────────────────────┤
│ Logout clears state │ After logout(), isLoggedIn false, stored user is null │
└────────────────────────────┴────────────────────────────────────────────────────────┘

Note: pinia-plugin-persistedstate must be applied to the test Pinia instance via
createPinia().use(piniaPluginPersistedstate). Use localStorage.clear() in
beforeEach/afterEach.

5.  e2e/login.spec.ts (extend existing)

Add to the existing describe block:

┌─────────────────────────────┬──────────────────────────────────────────────────┐
│ Criterion │ Test │
├─────────────────────────────┼──────────────────────────────────────────────────┤
│ Login redirects to /explore │ Fill form → click Sign in → assert URL /explore │
├─────────────────────────────┼──────────────────────────────────────────────────┤
│ Auth persists across reload │ Login → page.reload() → assert still on /explore │
└─────────────────────────────┴──────────────────────────────────────────────────┘

6.  docs/agent-runs/YYYY-MM-DD-persist-login.md (new — per R3)

Run log created after implementation, recording the new dependency reason.

---

What Does NOT Change

- src/views/LoginView.vue — no changes
- src/router/index.ts — guard reads auth.isLoggedIn synchronously; works as-is
- No other stores, composables, or components

---

Verification

1.  pnpm typecheck — no type errors
2.  pnpm test — new unit tests pass; existing tests unaffected
3.  pnpm test:e2e — new e2e tests pass (login redirect + reload persistence)
4.  Manual: pnpm dev → login → refresh → stays on /explore

---

Branch & PR

- Branch: feat/001-persist-login (off main, per R5)
- PR opened against main; human merges (R6)
