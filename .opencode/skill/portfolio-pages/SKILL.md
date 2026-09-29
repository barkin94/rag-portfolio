---
name: portfolio-pages
description: Main portfolio pages including Home, Tech Stack, Journey/Experience, layout, navigation, header, footer, sidebar, and theme toggling. Use when modifying landing page sections, navigation, or site layout.
---

# Portfolio Pages Skill

This skill provides context for the main portfolio pages.

## Queries

- Modify home page: "Find page.tsx with Home Experience TechStack Contact Footer"
- Change navigation: "Find Header NavLinks SideBar navItems layout.tsx"
- Theme toggle: "Find ThemeToggleButton cookie theme dark light getThemeCookieInServer"
- Particles background: "Find ParticlesBackground ParticleBackgroundProps layout.tsx"
- Contact form: "Find Contact Form SMTP CONTACT_EMAIL contact route"
- Maintenance mode: "Find maintenance page.tsx MAINTENANCE_MODE config.ts"

## Key Files

- `app/page.tsx` - Home page (composes sections)
- `app/layout.tsx` - Root layout (providers, fonts, particles, SW)
- `app/maintenance/page.tsx` - Maintenance mode page
- `app/_components/Home/index.tsx` - Home section wrapper
- `app/_components/Home/About/index.tsx` - About section
- `app/_components/Experience/index.tsx` - Experience timeline
- `app/_components/TechStack/index.tsx` - Tech stack display
- `app/_components/Contact/index.tsx` - Contact form
- `app/_components/Contact/Form/index.tsx` - Contact form component
- `app/_components/Footer/index.tsx` - Footer
- `app/_components/Header/index.tsx` - Main header
- `app/_components/Header/NavLinks/index.tsx` - Navigation links
- `app/_components/Header/SideBar/index.tsx` - Mobile sidebar
- `app/_components/Header/ThemeToggleButton/index.tsx` - Dark/light toggle
- `common/components/ParticlesBackground/index.tsx` - Animated background
- `common/components/ServiceWorkerRegistration/index.tsx` - PWA registration
- `common/utils/cookie.ts` - Theme cookie handling