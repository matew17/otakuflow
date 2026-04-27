# PR Review Checklist

## Scope & spec

- [ ] Diff matches PRD scope; no unrelated changes.
- [ ] All PRD acceptance criteria are satisfied.
- [ ] Out-of-scope items listed in PRD are honored.

## Correctness

- [ ] Types pass (no `any` introduced without comment).
- [ ] Lint passes; no disabled rules.
- [ ] Error states handled.
- [ ] Empty / loading states handled.
- [ ] Race conditions considered (debounce, cancel, stale responses).

## Tests

- [ ] Unit tests cover new logic.
- [ ] E2E added if user-facing.
- [ ] Tests fail without the change (confirmed mentally or by a flip).
- [ ] No tests assert on irrelevant internal structure.

## UX / frontend

- [ ] Accessible: labels, roles, keyboard path, focus management.
- [ ] Responsive: works on narrow viewport.
- [ ] i18n-safe: no hardcoded strings in a translated app.
- [ ] No console errors/warnings in dev server.

## Security

- [ ] No secrets in diff.
- [ ] No new `v-html` / dangerouslySetInnerHTML.
- [ ] New deps justified; no known-malicious package names.

## Observability

- [ ] Logs meaningful; no `console.log` left in production paths.
- [ ] Errors surfaced via existing error channel.

## Agent-specific

- [ ] Run log committed under `docs/agent-runs/` and linked in PR body.
- [ ] PR body generated from run log narrates decisions.
- [ ] Reviewer subagent comment is present and addressed.
