# Task: <title>

## Summary

<1–2 lines>

## Acceptance criteria

- AC1 …
- AC2 …

## Decomposition

| #   | Step                      | Owner        | Ground truth    | Reversibility |
| --- | ------------------------- | ------------ | --------------- | ------------- |
| 1   | Create PRD                | planner      | human approval  | revert file   |
| 2   | Scaffold types/composable | implementer  | tsc             | revert commit |
| 3   | UI component              | implementer  | vitest + manual | revert commit |
| 4   | Wiring & route            | implementer  | e2e             | revert commit |
| 5   | Tests                     | tester       | test suite      | revert commit |
| 6   | Review                    | reviewer     | checklist       | comments only |
| 7   | PR + CI                   | orchestrator | required checks | PR closed     |

## Risks & unknowns

- …

## Out of scope

- …
