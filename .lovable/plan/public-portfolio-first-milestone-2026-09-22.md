# Public Portfolio — First Milestone

## Goal
Rebuild the attached hand-designed prototype as a polished, responsive React portfolio while preserving its hierarchy: introduction, profile area, rating prompt, comments prompt, about details, work/projects, and “Let’s Connect” messaging concept.

This milestone covers phases 1–4 only. Authentication, stored profiles, ratings, comments, chat, owner dashboard, email notifications, and security rules remain a later milestone.

## What I’ll Build
- A strong public home page with a compact modern navigation, prominent frontend-developer introduction, profile-photo placeholder, rating summary, comments prompt, featured work, and clear paths to About, Work, and Connect.
- A dedicated About page with editable placeholder fields for name, introduction, education, skills, experience, client work, and technologies.
- A dedicated Work page driven by a typed project data file. Project cards will include a replaceable image area, title, short placeholder description, technologies, category, and optional live/GitHub links.
- A dedicated Connect page styled as a real chat preview. Sending a message will clearly indicate that sign-in is required in the next milestone rather than pretending to save anything.
- Rating and comment interactions that preserve the prototype’s intent while clearly communicating that account access is required and will be enabled in the next milestone.
- Shared site navigation and footer across public pages, with mobile-friendly layouts and accessible controls.

## Visual Direction
- Preserve the prototype’s asymmetrical two-column opening, shaped portrait area, prominent action placement, compact project panel, and direct transitions into About, Work, and Connect.
- Use a neutral espresso/graphite/warm-white foundation with burgundy branding, champagne highlights, arctic-blue project actions, vermilion comment actions, and dark-moss connect actions.
- Add restrained glass surfaces, fine borders, subtle grid texture, controlled glow, modern large typography, and small motion details without cyberpunk styling.
- Use a clearly labeled temporary portrait placeholder that can be replaced without changing the layout.
- Respect reduced-motion preferences and ensure comfortable touch targets and readable text at mobile, tablet, laptop, and desktop widths.

## Structure
- Shared reusable pieces for navigation, buttons, section headings, project cards, rating display, comment prompt, portrait placeholder, chat preview, and footer.
- Central editable portfolio content and project data, keeping all unknown personal details visibly marked as placeholders rather than inventing information.
- Separate public routes for Home, About, Work, and Connect, each with unique page metadata.
- Semantic design tokens in the global style system for all palette, typography, borders, shadows, and motion.

## Validation
- Verify all public navigation and interactions in the running preview.
- Check desktop and mobile layouts for overflow, overlap, legibility, and tap comfort.
- Confirm reduced-motion behavior and keyboard-visible focus states.
- Confirm the project compiles cleanly and no placeholder template remains at `/`.

## Deferred Backend Milestone
After the public portfolio is approved, enable Lovable Cloud and add Google sign-in, stored user profiles, protected ratings/comments, real-time one-to-one chat, UID-enforced owner access, the separate owner dashboard, reply email notifications, and database security policies. Firebase-specific implementation will be adapted to the platform’s secure managed backend rather than exposing credentials in the browser.
