---
task: <id-slug>
date: <YYYY-MM-DD>
branch: feat/<id>-<slug>
pr: <#>
agents_used: [planner, implementer, tester, reviewer]
models: { planner: haiku, implementer: sonnet, tester: sonnet, reviewer: haiku }
---

# Run log — <title>

## Brief

<one line>

## PRD

[docs/prds/<id>-<slug>.md](../prds/<id>-<slug>.md)

## Decisions

- D1: …
- D2: …

## Subagent calls

1. planner — input <summary>; output <path>; duration <m:ss>; cost <est>.
2. implementer — …
3. tester — …
4. reviewer — …

## Diffs of note

- <file> — <why>

## Failures and retries

- <what failed, what we changed, what fixed it>

## Open tech debt

- …

## Follow-ups

- …
