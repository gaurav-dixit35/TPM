# Q1 — Users and features

| User | Owns | V1 actions |
|---|---|---|
| Nurse | Temperature leg | View due queue, record one official daily reading, see prior reading |
| Doctor | Visit and verdict | Review queue/history, record visit and plan, recommend standard/early discharge, record outcome |
| Front Desk | Admission and bed release | Admit to free bed, view handoffs, process discharge, update occupancy |
| Centre Lead | Oversight | Read-only coverage, occupancy, outcomes and exception flags |
| System | Derived workflow | Create daily queues, calculate fever-free streak, flag duplicates and eligibility |

Feature allocation: role picker is a prototype stand-in for login. Directory and profiles are lookup-only across roles. Temperature editing/correction is attributable and reasoned in a production system. The Lead has no write actions. Pain-point mapping: duplicate/missed checks → daily queue and one-reading rule; premature doctor round → ready queue; extra bed-days → explicit discharge handoff; mortality blind spot → defined outcome reporting.

Design decisions: queues before databases; recommendation becomes a tracked handoff; discharge outcome must be recorded; lead view is read-only. Assumptions in `ASSUMPTIONS_AND_OPEN_QUESTIONS.md`.
