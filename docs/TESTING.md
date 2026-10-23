# Testing

Automated verification on 23 October 2026: `npm test` passes 78 tests (62 domain tests plus 16 React workflow tests in jsdom); `npm run build` and `npm run lint` pass. The UI tests cover demo sign-in and exit, role switching, queue filters, temperature-to-visit handoff, urgent override reasons, discharge and bed reuse, tour navigation/replay, malformed stored data, disabled storage writes, and Fahrenheit display. No browser end-to-end or real-device test has been completed.

These checks do not replace browser end-to-end or accessibility testing. Before submission, run the deployed app in current Chrome and a private window; verify direct-route fallback, keyboard-only operation, reduced motion, contrast, and layouts at 360, 768, and 1280 px. Also check Safari/iOS Safari and Android Chrome if available. No live browser or device matrix has been completed for this snapshot.
