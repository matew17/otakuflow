# 2026-04-24 — Persist Login State (Task 001)

## What I Did

- Added `pinia-plugin-persistedstate` to persist auth state across page reloads
- Registered the plugin in `src/main.ts` (extracted Pinia instance to apply plugin before mounting)
- Configured `useAuthStore` with `persist: { key: 'otakuflow:user', pick: ['user'] }` as third `defineStore` argument
- Fixed store ID from `''` to `'auth'`
- Added 5 unit tests in `src/__tests__/useAuthStore.spec.ts` covering: initial state, login, logout, localStorage persistence, and hydration from storage
- Added 2 e2e tests to `e2e/login.spec.ts`: login redirect and reload persistence

## New Dependency

- **`pinia-plugin-persistedstate@4.7.1`** — chosen over a custom plugin for its Pinia-native API and active maintenance. Avoids re-implementing `$subscribe` + localStorage boilerplate. Peer dep: `pinia >=3.0.0` ✓

## Non-obvious Implementation Detail

`pinia.use(plugin)` in a jsdom test environment queues the plugin to `toBeInstalled` (not `_p`) unless the Pinia instance is installed in a Vue app first. Unit tests must call `createApp({}).use(pinia)` to properly initialize the plugin. Additionally, the plugin's `$subscribe` callback fires asynchronously — tests that assert localStorage state must `await nextTick()`.

## Gates

- `pnpm typecheck` ✓
- `pnpm test` ✓ (6/6)
- `pnpm test:e2e` ✓ (6/6)
