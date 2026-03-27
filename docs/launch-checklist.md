# Lumina Codex Launch Checklist

## Product
- Verify chamber transitions feel intentional on desktop and mobile.
- Verify each principle chapter opens, closes, and navigates correctly.
- Verify lite mode still feels premium on smaller screens.

## Accessibility
- Run keyboard-only pass across era toggles, principle triggers, and chapter overlay.
- Verify reduced-motion behavior and screen-reader announcements.
- Verify chapter overlay focus is trapped and restored correctly.

## Performance
- Run `npm run verify`.
- Check Lighthouse on desktop and mobile.
- Confirm no console errors in local or preview builds.

## Deployment
- Set `NEXT_PUBLIC_SITE_URL` for the target domain.
- Attach the project to Vercel.
- Validate metadata, sitemap, and robots on the deployed URL.
