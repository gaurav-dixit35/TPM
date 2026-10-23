# Deployment

1. Push the project to a Git repository and import it at Vercel.
2. Select Vite; build command `npm run build`; output `dist`; no environment variables.
3. `vercel.json` rewrites SPA paths to `index.html` and applies the configured security headers.
4. Test a deep URL, private browsing, mobile layout and browser storage behavior.
5. Add production URL to README/About before submission. Deploy via CLI with `npx vercel --prod` if desired.

The app is a static demo, but it does not include a service worker or offline synchronization. Browser storage is local to the current browser and is not a shared or backed-up record system. Do not enter real patient information.

The user-provided production URL is `https://sajag-care.vercel.app/`. After deploying a new build, open this exact URL in a private browser window and verify the stakeholder demo sign-in, role-specific views, client-side navigation, refresh fallback, and security headers. A Vercel deployment is a static frontend; browser storage is local to each browser and is not shared across staff.
