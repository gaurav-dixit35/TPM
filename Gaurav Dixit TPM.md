# SAJAG

## Every patient. Every day. Nothing dropped.

**Product management submission · Technical Product Manager**  
**Prepared by:** Gaurav Dixit  
**Role applied for:** Technical Product Manager  
**Date:** 23 October 2026  
**Care setting:** Sahyadri Care Centre · 74-bed quarantine facility

> **Live prototype:** [https://sajag-care.vercel.app/](https://sajag-care.vercel.app/) · Verified to load on 23 October 2026. Choose a stakeholder on the demo sign-in screen, then start with **Help → Reviewer Walkthrough**. Demo data is fictional and stored in this browser only. This prototype is not for clinical use.

**QR code:** Generate from the live URL above and include beside the printed URL in the final PDF.

### The idea

Sajag makes the daily care relay visible: **Front Desk admits → Nurse records temperature → Doctor reviews and visits → Doctor records a verdict → Front Desk processes a discharge → Centre Lead monitors the ward.** Its first release addresses missed or duplicate readings, visits made before a reading is available, unclear discharge handoffs, and limited operational visibility. The app demonstrates four staff roles plus a System actor that derives queues and status.

### Review Sajag in three minutes

1. Open the live prototype, choose a stakeholder role at demo sign-in, then use **Help → Reviewer Walkthrough** for the one-time, role-aware guide.
2. In **Nurse**, open a patient awaiting a temperature and record one reading.
3. Switch to **Doctor** and see the patient move into the visit workflow; record a note and verdict.
4. Switch to **Front Desk** to process a discharge handoff, or open **Beds** to inspect occupancy and free beds.
5. Open **Centre Lead** to review the operational overview. Visit **Settings** to reset the demo or load a scenario.

> Demo sign-in selects a role; it does not verify identity. The role switcher is a preview control, not authentication. Do not enter real patient information.

<!-- PAGE BREAK -->

# Q1 · Users, needs, and features

## Users and responsibilities

| User / actor | Primary need | Sajag responsibility in V1 | Write access in prototype |
|---|---|---|---|
| **Nurse** | Know who still needs a daily reading; avoid duplicate work | Review the due queue, record one temperature, see an existing reading and patient history | Temperature entry |
| **Doctor** | Spend visit time on care, with today’s reading ready | Review measured patients, record visit notes and treatment plan, choose a care or discharge verdict | Visit, plan, and verdict |
| **Front Desk** | Know which discharges are confirmed and which beds are available | Admit to an available bed, process doctor handoffs, release beds, and review occupancy | Admission and discharge processing |
| **Centre Lead** | See coverage, exceptions, occupancy, and outcomes | Review ward-level indicators and attention flags without changing clinical records | Read-only |
| **System** | Keep the relay consistent and visible | Derive role queues, prevent duplicate daily readings, surface ordering and eligibility rules, and calculate demo indicators | Automated state and derived views |

## Role-to-feature matrix

| Feature | Nurse | Doctor | Front Desk | Centre Lead | System |
|---|:---:|:---:|:---:|:---:|:---:|
| Daily due queue | Use | Review | — | Monitor | Derive |
| Record one official daily temperature | Own | Read | — | Read | Validate |
| Review reading and prior history | Use | Use | Lookup | Read | Store in browser |
| Doctor visit, note, treatment, verdict | — | Own | Receive handoff | Read | Validate and route |
| Standard discharge recommendation | — | Own when eligible | Receive | Monitor | Check 3-day rule |
| Discharge after eligibility | — | Recommend after the three-day fever-free criterion | Process handoff | Monitor | Block before eligibility |
| Admit and assign bed | — | — | Own | Monitor | Check capacity and duplicate name |
| Process discharge and release bed | — | — | Own | Monitor | Update occupancy |
| Occupancy, coverage, attention, outcomes | — | — | Operational view | Own read-only view | Calculate demo indicators |

## Problem-to-solution mapping

| Reported problem | V1 response | Where the reviewer sees it |
|---|---|---|
| Nurses cannot tell who has already been measured | One visible daily queue; saved readings appear on the patient; duplicate daily entry is blocked | Nurse **Round**, patient record, temperature dialog |
| Some readings are duplicated while others are missed | Role-owned due queue and one-reading rule make outstanding work explicit | Nurse **Round** and patient list |
| Doctor visits happen before the daily temperature | Measured patients become ready for the Doctor; unmeasured patients are labelled as waiting for Nurse | Doctor **Round** and patient row |
| Discharge recommendation does not reach administration | Doctor verdict creates a visible Front Desk handoff; bed is released only when processed | Doctor patient workflow, Front Desk queue, **Beds** |
| Patients may stay longer because work is not coordinated | A visible handoff and bed state make the next operational action discoverable | **Round**, **Beds**, ward snapshot |
| Centre cannot compare outcomes with the 85% success / 15% mortality benchmark | Outcome and mortality views are demonstrated with explicit cohort and definition caveats | **Centre Lead** overview and **Settings** demo scenarios |

## Scope boundary

| V1 prototype now | Later, after operational and clinical validation |
|---|---|
| Role-specific queues; temperature entry and confirmation; visit notes and verdict; discharge handoff; bed map; patient lookup; guide; activity feed; demo settings and reset | Authentication and server authorization; durable shared database; real audit trail and corrections; notifications and shift scheduling; integrations; treatment templates; exportable cohort analytics; production-grade backup, monitoring, and retention |

**Product decision:** V1 prioritizes *visibility of the next owner and handoff* over automating clinical decisions. The app supports coordination; clinicians remain responsible for care decisions.

<!-- PAGE BREAK -->

# Q2 · Prototype and walkthrough

## Live prototype and technical approach

> **Prototype URL:** [https://sajag-care.vercel.app/](https://sajag-care.vercel.app/) · Open the demo sign-in, choose a role, then follow the reviewer walkthrough. This is a frontend demo; role selection is not authentication.

| Layer | Current implementation | Why it fits this assessment prototype |
|---|---|---|
| UI | React 18, TypeScript 5.7, Vite 6.4.5 | Typed, component-based front end with a quick static production build |
| Interaction | React state, browser `localStorage`, Framer Motion | Demonstrates role flows, persistence in one browser, and restrained transitions without introducing a backend |
| Visual system | Authored CSS; Newsreader and Manrope; IBM Plex Mono for readings; Lucide icons | Custom paper-and-ward palette, editorial display type, clear operational text, and legible measurements without a generic component kit |
| Hosting | Vercel static deployment; output directory `dist`; `vercel.json` SPA fallback and security headers | Fits Vite static output; no server environment variables are required for the prototype |
| Quality checks | TypeScript build, lint check, 62 domain tests, 16 React workflow tests in jsdom | Checks compile-time correctness, key rules, and interface workflows; no browser end-to-end suite is included |

### Key screens to capture before export

No screenshots are embedded in this draft. Capture the verified deployed build at desktop and 360–390 px mobile widths before exporting the recruiter PDF. Use fictional data only; do not submit this section without the screenshots requested by the assessment.

| Screen | Insert image | Caption |
|---|---|---|
| Nurse · Today’s round | Pending capture | A due queue makes the Nurse’s next reading easy to find and records progress once per patient per day. |
| Doctor · Ready for your visit | Pending capture | The Doctor sees measured patients ready for review and an explicit waiting state when the Nurse’s reading is missing. |
| Front Desk · Discharge handoffs | Pending capture | Confirmed handoffs are actionable; processing one releases the bed and updates occupancy. |
| Centre Lead · Centre pulse | Pending capture | A read-only overview shows the state of the daily relay and operational attention flags. |
| Beds · Ward floor plan | Pending capture | The 74-bed map distinguishes occupied, fever-flagged, discharge-ready, and available beds. |

## Care relay

```mermaid
flowchart LR
    A[Front Desk admits patient] --> B[Nurse records daily temperature]
    B --> C[Doctor reviews and visits]
    C --> D[Doctor records care verdict]
    D -->|Continue care| B
    D -->|Discharge handoff| E[Front Desk confirms discharge]
    E --> F[Bed released]
    F --> A
    B -. operational visibility .-> G[Centre Lead monitors]
    C -. operational visibility .-> G
    E -. operational visibility .-> G
```

## Key workflows

### Record a temperature (Nurse)

1. Choose **Nurse** from the role picker and open **Today’s round**.
2. Select a patient still waiting for a reading and choose **Record temp**.
3. Enter the measured value in Celsius. The prototype accepts 34.0–42.0°C; values below 35.0°C or above 40.5°C prompt confirmation.
4. Save. A second official reading for the same patient/day is blocked; the patient’s state moves into the Doctor’s measured queue.
5. The patient record and activity feed show the reading. Demo changes persist in this browser’s local storage.

### Review and visit a patient (Doctor)

1. Switch to **Doctor**. Patients with a reading are ready for review; patients without one remain marked **Waiting for nurse**.
2. Open a ready patient, review the available temperature/history, and enter a visit note and treatment plan.
3. Record a continuing-care verdict or a discharge recommendation. Sajag blocks a discharge recommendation until the three-day fever-free criterion is met. A deceased outcome requires a reason in the UI.
4. A discharge verdict creates a Front Desk handoff. A visit itself does not release a bed.

### Process a discharge (Front Desk)

1. Switch to **Front Desk** and open **Discharge handoffs**.
2. Review the patient and confirm the discharge action.
3. Sajag records the demo outcome, marks the bed free, and updates occupancy. Front Desk can then admit an eligible new patient to that bed.

### Admit a patient (Front Desk)

1. Open **Beds** and select an available tile.
2. Enter a name and age; the prototype checks required name, age range, duplicate active name, and bed availability.
3. Confirm to assign the selected bed. The new patient appears in the active round.

## Prototype limits and verification status

- **No backend or authentication:** local browser state is not a shared source of truth, and role switching is not access control. Different devices do not share updates.
- **Fictional data:** do not enter personally identifiable or real patient information. Browser storage does not provide production security, backup, or an audit trail.
- **Simulated clock and seeded histories:** demo scenarios and outcome records exist to make the workflow reviewable; they are not facility data or validated quality reporting.
- **Clinical definitions are provisional:** 38.0°C, suspect ranges, and the interpretation of “three full days” need head-doctor approval before any operational use.
- **Automated checks:** on 23 October 2026, `npm test` passed 78 tests (62 domain and 16 React workflow tests in jsdom); `npm run build` and `npm run lint` passed. No browser end-to-end or real-device test has been completed. These checks do not establish clinical safety or production readiness.
- **Deployment:** the user-provided prototype URL is listed above. Confirm the deployed build reflects this demo sign-in and the three-day discharge rule before presenting it as the latest version.

<!-- PAGE BREAK -->

# Q3 · Business rules and safeguards

Sajag uses three response levels to communicate what the user can do next. The software should make the reason visible and preserve a clear route for legitimate exceptions.

| Level | Meaning | Example |
|---|---|---|
| **Block** | Stop an action that violates an operational rule; explain what is missing or who owns it | Block a duplicate daily reading or a routine Doctor visit before today’s reading |
| **Confirm** | Allow a deliberate action after the user checks the risk or provides a reason | Confirm a suspect temperature or a Front Desk bed release |
| **Nudge** | Surface useful status or eligibility without substituting for clinical judgment | Show a three-day fever-free eligibility signal or missing reading |

## Rule catalogue

| Area | Rule and prototype behaviour | Level / owner | Production consideration |
|---|---|---|---|
| Temperature · ownership | Only Nurse may record the official daily reading | Block · Nurse | Enforce on the server using authenticated staff identity and role authorization |
| Temperature · duplicate | One official reading per patient per care day; keep the existing value visible and do not silently overwrite | Block · Nurse | Define repeat measurement, correction window, reason, attribution, and audit history |
| Temperature · plausible range | Reject a non-number or value outside 34.0–42.0°C | Block · Nurse | Validate units, device protocol, data entry, and approved clinical ranges |
| Temperature · suspect range | A value below 35.0°C or above 40.5°C prompts a reconfirmation | Confirm · Nurse | These thresholds are illustrative and must be set by clinical leadership |
| Fever status | Prototype marks 38.0°C or higher as fever | Nudge / calculation · System | Confirm the measurement method, threshold, and whether the rule is age/context dependent |
| Visit ordering | Routine Doctor visit requires today’s temperature; otherwise show **Waiting for nurse** | Block · Doctor | The doctor must retain an approved urgent override that records a reason and is visible in the audit log |
| Three-day eligibility | Surface standard discharge eligibility after three consecutive fever-free days; a fever or missing day breaks the streak | Nudge · System/Doctor | “Three full days” could mean 72 hours or three defined calendar days. Confirm policy and timezone. Do not auto-discharge. |
| Standard discharge | Doctor records a recommendation; Front Desk processes the handoff and releases the bed | Nudge → Confirm · Doctor/Front Desk | Define authorized clinical sign-off and required discharge documentation |
| Admission | Only Front Desk admits; block if no bed is free or an active patient with the same name exists | Block · Front Desk | Use a safe patient identifier; name alone is not a reliable identity match |
| Outcome reporting | Demo mortality is deaths / closed demo cases × 100 and is compared with the 15% reference | Nudge · Centre Lead/System | Define cohort, time window, transfers, minimum sample, exclusions, confidence, and review cadence |
| Daily coverage | Show whether active patients have a temperature and a Doctor visit recorded today | Nudge · Centre Lead | Specify the care-day boundary, due time, overdue escalation, and exception handling |
| System time | Demo clock can advance to show daily queue rollover | Nudge · System | Production timestamps must be server-generated, timezone-aware, and traceable |
| Privacy and access | Prototype data stays in browser storage; demo sign-in and role switcher select a view but do not authenticate users | Important limitation | Production requires authentication, server authorization, encryption, retention policy, audit, backup, and incident response |

> **Assumptions to confirm with the head doctor before real use**
>
> 1. What fever threshold and measurement protocol should Sajag use, and should either vary by patient group?
> 2. Does “three full days without a fever” mean three consecutive calendar-day readings, 72 elapsed hours, or another approved interpretation?
> 3. Does a missing daily reading break the streak? How should repeat or corrected readings be handled and attributed?
> 4. What constitutes an urgent visit override, who may authorize it, and what reason must be recorded?
> 5. Who signs off an eligible discharge, and what information must be communicated to the patient and Front Desk?
> 6. How should deaths, transfers, readmissions, and incomplete cases affect the mortality/success rate? What cohort period and minimum denominator are appropriate?
> 7. What daily deadline, escalation route, and local timezone govern missed temperatures and visits?

### Quality metric interpretation

The brief states an expected mortality rate of 15% and an 85% success benchmark. These percentages are complements only if the case definition and denominator are aligned. A small or incomplete cohort can move sharply with one outcome. Sajag’s prototype indicator must therefore be treated as an illustration, not a validated performance measure or clinical alert. Centre leadership should approve the cohort, period, minimum sample, and handling of transfers before using it for decisions.

<!-- PAGE BREAK -->

# Q4 · Sprint planning

## Capacity and selection

Sprint capacity is **25 points**. Existing commitments consume **15**, leaving **10 points** for the candidate work. Value uses the assessment’s Low / Medium / High scale of **1 / 3 / 6**. The scorecard below uses the supplied A–J story estimates and preserves the assessment’s target selection.

| Capacity calculation | Points |
|---|---:|
| Total sprint capacity | 25.0 |
| Existing commitments | −15.0 |
| **Remaining for candidate stories** | **10.0** |
| Selected stories’ stated effort | +8.3 |
| **Total planned load** | **23.3 / 25.0** |
| **Unallocated buffer** | **1.7** |

## Candidate scorecard and final pick

Ratio is calculated as value divided by effort; a higher ratio indicates more stated value per effort point. Ratios are rounded to two decimal places.

| Story | Value | Effort | Value / effort |
|---|---:|---:|---:|
| A | 6 | 1.0 | 6.00 |
| B | 6 | 3.0 | 2.00 |
| C | 6 | 5.0 | 1.20 |
| D | 3 | 2.0 | 1.50 |
| E | 3 | 3.0 | 1.00 |
| F | 3 | 1.0 | 3.00 |
| G | 1 | 0.4 | 2.50 |
| H | 1 | 0.5 | 2.00 |
| I | 1 | 0.3 | 3.33 |
| J | 1 | 0.1 | 10.00 |

| Decision | Stories | Value | Effort | Notes |
|---|---|---:|---:|---|
| **Select** | A, B, D, F, G, H, I, J | **22** | **8.3** | Assessment-provided target; aggregate ratio is 22 ÷ 8.3 = **2.65 value/effort** |
| **Leave out** | C, E | — | — | C uses 5 effort for 6 value and forces a lower-value swap under the 10-point story budget; E offers the same 3 value as D at 1 more effort. |
| **Committed work** | Three stories | — | **15.0** | 3 × 5 points |
| **Remaining capacity** | Candidate work | — | **10.0** | 25 − 15 |
| **Total planned load** | Commitments + selected work | — | **23.3 / 25** | Leaves a **1.7-point** buffer |

**Decision:** select **A, B, D, F, G, H, I, J**; leave out **C and E**. This uses 8.3 of the 10 points remaining after existing commitments, for 23.3 of 25 points overall and a 1.7-point buffer.

**Why C and E are excluded:** C’s 5-point effort does not fit alongside the higher-value selections without dropping more value than it adds. E has the same medium value as D but needs one extra effort point. The selected stories total 22 value and 8.3 effort, leaving 1.7 points of sprint buffer.

**Dependency and risk caveat:** the selected set is an assessment-provided target, not an independently optimized plan. Confirm story dependencies, owner availability, and the unprovided item-level estimates before commitment. Protect the 1.7-point buffer for integration, validation, and unplanned work; if a dependency blocks a selected item, re-plan against the visible value/effort inputs rather than silently exceeding capacity.

<!-- PAGE BREAK -->

# Delivery notes · Measures, decisions, and risks

## Success measures to validate in a pilot

| Measure | Definition | Why it matters |
|---|---|---|
| Daily temperature coverage | Active patients with an official reading today ÷ active patients due today | Measures whether the Nurse round is complete |
| Doctor visit coverage | Active patients visited today ÷ active patients requiring a visit today | Measures completion of the same-day Doctor requirement |
| Ordering compliance | Routine visits after a same-day reading ÷ routine visits | Tests whether the Nurse-to-Doctor dependency is working |
| Duplicate-reading rate | Duplicate attempts or saved duplicates per 100 patient-days | Tests reduced rework; distinguish blocked attempts from data errors |
| Discharge handoff delay | Time from Doctor recommendation to Front Desk processing | Finds avoidable bed-days caused by communication gaps |
| Occupancy and bed turnaround | Occupied beds ÷ 74; time from discharge processing to next admission | Measures throughput while keeping bed status visible |
| Outcome rate | Approved outcome numerator ÷ approved closed-case denominator, by defined cohort and period | Tracks the 15% mortality / 85% success benchmark only after clinical and statistical definitions are approved |

No baseline or target has been invented. Establish a baseline from reliable facility data and set targets with the care team before evaluating impact.

## Decision log

| Decision | Rationale | Revisit when |
|---|---|---|
| Queues are organized by role and next action | Reduces ambiguity about who owns today’s next step | Pilot feedback shows queue ordering or ownership is unclear |
| A Doctor recommendation is a handoff, not an automatic bed release | Keeps clinical decision and administrative processing distinct | Facility discharge policy and authorization are documented |
| Centre Lead is read-only in the prototype | Oversight should not accidentally alter care or handoffs | Production permissions and delegated workflows are approved |
| Use a local demo state and fictional seed data | Enables a fast, reviewable Vercel prototype without backend setup | Before any live facility pilot; production requires secure shared records |
| Treat threshold, streak, and mortality rules as provisional | Clinical and reporting definitions were not supplied | Head doctor and centre leadership approve a written policy |

## Key risks and mitigations

| Risk | Potential impact | Mitigation / release condition |
|---|---|---|
| Provisional clinical thresholds or streak semantics | Incorrect eligibility or workflow cues | Obtain written clinical approval; version and audit policy changes |
| Local-only data and simulated roles | Staff may see inconsistent data or access records improperly | Do not use for patient care; implement backend identity, authorization, shared storage, audit, and backups |
| Misleading mortality percentage | Poor decisions from small or inconsistent cohorts | Agree denominator, cohort dates, minimum sample, transfer handling, and uncertainty display |
| Missed or delayed actions despite queue visibility | Care requirement still goes unmet | Pilot overdue definitions, escalation, ownership, and shift handoff |
| Name-based duplicate check | Different people can share a name; same person can be entered differently | Introduce a facility-approved unique identifier and identity matching workflow |
| Deployment placeholder or unverified URL | Recruiter cannot open the prototype | Deploy, test the actual Vercel URL in a private window, then replace all three URL placeholders and regenerate the QR code |

## Roadmap

| Release | Focus | Candidate capabilities |
|---|---|---|
| **V1 · Visibility** | Make daily work and handoffs explicit | Role queues, temperature capture, visit readiness, discharge handoff, bed status, basic oversight |
| **V2 · Communication** | Help teams act on work across shifts and devices | Approved reminders, shift scheduling, multi-ward support, treatment templates, audit exports, cohort analytics |
| **Production hardening** | Protect records and enforce approved policy | Authentication, server-side permissions and rules, shared database, audit, backup, monitoring, retention, accessibility and security review |

## AI tool disclosure

OpenAI Codex supported implementation and editorial work on this prototype and submission. I am responsible for reviewing the product decisions and claims before sharing them. Clinical assumptions remain provisional and require approval from care stakeholders.

<!-- PAGE BREAK -->

# Quick links

| Resource | Link / action |
|---|---|
| **Live Sajag prototype** | [https://sajag-care.vercel.app/](https://sajag-care.vercel.app/) · User-provided deployment; verify the latest build after redeployment. |
| **GitHub repository** | [github.com/gaurav-dixit35/TPM](https://github.com/gaurav-dixit35/TPM) *(public repository; verify it contains the final version before submitting)* |
| **In-app reviewer guide** | Open the prototype → **Help** → **Reviewer Walkthrough** |
| **Project documentation** | [README](README.md) · [Prototype guide](docs/PROTOTYPE_GUIDE.md) · [Business rules](docs/BUSINESS_RULES.md) · [Users and features](docs/USERS_AND_FEATURES.md) · [Deployment](docs/DEPLOYMENT.md) |
| **QR code** | Insert the QR image generated from the verified live URL after deployment |

### Final submission checklist

- [ ] Redeploy the latest Sajag build and verify the public URL in a private browser window.
- [ ] Insert desktop and mobile screenshots from the verified deployment; keep demo records fictional.
- [ ] Generate the QR code from the verified URL and insert it on page 1 and/or the quick-links page.
- [x] Public GitHub repository link identified; confirm it points to the final committed version before submission.
- [ ] Recheck A–J scorecard against the assessment PDF and verify all totals before final export.
- [ ] Export the final reviewed document as **`Gaurav Dixit TPM.pdf`** only after all release blockers are cleared; verify links, pagination, screenshots, and QR code.

**End of submission draft**
