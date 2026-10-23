# Testing

Automated verification on 23 October 2026: `npm test` passes 73 tests (64 domain tests plus 9 React workflow tests in jsdom); `npm run build` and `npm run lint` pass; `npm audit` reports zero known package vulnerabilities. The UI tests cover role switching, queue filters, temperature-to-visit handoff, urgent override reasons, discharge and bed reuse, tour navigation/replay, malformed stored data, disabled storage writes, and Fahrenheit display.

These checks do not replace browser end-to-end or accessibility testing. Before submission, run the deployed app in current Chrome and a private window; verify direct-route fallback, keyboard-only operation, reduced motion, contrast, and layouts at 360, 768, and 1280 px. Also check Safari/iOS Safari and Android Chrome if available. No live browser or device matrix has been completed for this snapshot.
