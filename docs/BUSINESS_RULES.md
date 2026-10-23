# Q3 — Business rules and constraints

| Rule | Trigger | Behaviour | Level | Role |
|---|---|---|---|---|
| Role ownership | Non-owner action | Block and explain | Block | All |
| Single official daily reading | Duplicate entry | Keep existing value visible; never silently overwrite | Block | Nurse |
| Plausible range | <34 or >42 °C | Reject and explain expected unit/range | Block | Nurse |
| Suspect value | <35 or >40.5 °C | Require reconfirmation | Confirm | Nurse |
| Routine visit ordering | No reading today | Show “Waiting for nurse”; no routine visit | Block | Doctor |
| Urgent exception | Doctor override | Require reason and flag in history | Confirm | Doctor |
| Cure criterion | Three consecutive full fever-free days | Surface eligibility; no automatic discharge | Nudge | System/Doctor |
| Missed day | No reading | Break streak; label missing, do not infer afebrile | Nudge | System |
| Early discharge | Doctor proposes early exit | Require reason and mark separately | Confirm | Doctor |
| Discharge processing | Front Desk handles confirmed handoff | Record outcome and release bed | Confirm | Front Desk |
| Capacity | No free bed | Disable admission | Block | Front Desk |
| Outcome metric | Closed cases | deaths / closed cases × 100; report cohort and period | Nudge | Lead |

These are prototype defaults, not approved clinical policy. Calendar-day reading is used for streak demonstration; actual “three full days” definition, fever threshold, and clock/timezone require clinician confirmation. Clinical urgency must always supersede software ordering under approved policy. Future backend must enforce every permission, uniqueness and state transition server-side.
