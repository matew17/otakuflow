# Test strategy: <feature>

## Principle

Tests validate the PRD, not the implementation.

## Mapping

| AC  | Test type | Test name                                                 | Status |
| --- | --------- | --------------------------------------------------------- | ------ |
| AC1 | unit      | `filter.spec.ts:it('filters by title, case-insensitive')` | ☐      |
| AC2 | e2e       | `e2e/search.spec.ts`                                      | ☐      |

## Coverage targets

- Logic (composables, utils): 90%+ lines, 85%+ branches.
- Components: behavioral — render + interactions. No snapshot tests.
- E2E: one happy path, one failure path per feature.

## Explicitly not tested

- …

## Manual QA

- Keyboard navigation.
- Screen reader labels read correctly.
- Dark mode visuals.
