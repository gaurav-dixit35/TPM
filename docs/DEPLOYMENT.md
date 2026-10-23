# Deployment

1. Push the project to a Git repository and import it at Vercel.
2. Select Vite; build command `npm run build`; output `dist`; no environment variables.
3. `vercel.json` rewrites SPA paths to `index.html`.
4. Test a deep URL, private browsing, mobile layout and browser storage behavior.
5. Add production URL to README/About before submission. Deploy via CLI with `npx vercel --prod` if desired.

The app is static and offline-capable after asset load. Do not enter real patient information.
