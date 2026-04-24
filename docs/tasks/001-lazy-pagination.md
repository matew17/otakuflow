## Task

Persist Login info locally

## Context

- Repo: https://github.com/matew17/otakuflow
- Branch base: main
- Related files: "planner: please find"
- Related docs: N/A

## Acceptance

- Functional:
  - When page loads I am requested my credentials
  - Keep existant behavior, but lets persist the data

- Non-functional: Make sure it performs well.
- Tests required: unit tests, e2e
- Out of scope: No need to validate username or password, nor calling api. Let's continue with the Mock Data but persist the state of the user being logged in or NOt.

## Authority

- Autonomy level: cautious
- Paths off-limits: .env
- Deadline: asap
