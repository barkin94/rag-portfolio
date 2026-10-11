---
name: portfolio-site
description: Public portfolio pages: Home (About, Experience, TechStack, Contact), layout/navigation (Header, SideBar, NavLinks, Footer), theme toggling (dark/light), particles background, contact form (SMTP), and maintenance mode page. Use when modifying landing page sections, navigation, theming, or site-wide layout.
---

# Portfolio Site

## Mental Model

```
app/layout.tsx (root: providers, fonts, particles, SW)
    │
    ├── app/page.tsx (Home) → About, Experience, TechStack, Contact, Footer
    ├── app/maintenance/page.tsx (when MAINTENANCE_MODE=true)
    ├── app/_components/Header → NavLinks (desktop), SideBar (mobile), ThemeToggle
    └── app/api/contact/route.ts (SMTP email)
```

## Key Queries (intent → entry point)

| Task | Search For |
|------|------------|
| Home sections | `page.tsx` `Home` `Experience` `TechStack` `Contact` `Footer` |
| Navigation | `Header` `NavLinks` `SideBar` `navItems` `layout.tsx` |
| Theme toggle | `ThemeToggleButton` `getThemeCookieInServer` `data-theme` cookie |
| Particles background | `ParticlesBackground` `ParticleBackgroundProps` `layout.tsx` |
| Contact form | `Contact/Form` `SMTP` `CONTACT_EMAIL` `contact/route.ts` |

## File Map

| Area | Files |
|------|-------|
| **Pages** | `app/page.tsx`, `app/maintenance/page.tsx` |
| **Sections** | `app/_components/Home/About`, `Experience`, `TechStack`, `Contact/Form`, `Footer` |
| **Layout/Nav** | `app/layout.tsx`, `app/_components/Header/{index,NavLinks,SideBar,ThemeToggleButton}` |
| **Shared** | `common/components/{ParticlesBackground,ServiceWorkerRegistration}`, `common/utils/cookie.ts` |
| **API** | `app/api/contact/route.ts` |

## Critical Patterns

- **Theme SSR**: `layout.tsx` reads cookie via `getThemeCookieInServer()` → sets `data-theme` on `<html>`; `ThemeToggleButton` updates localStorage + cookie
- **Add home section**: Create `Home/NewSection` → import in `page.tsx` → add anchor in `NavLinks`/`SideBar`
- **Nav items**: Edit `navItems` array in `NavLinks/index.tsx` and `SideBar/index.tsx` (`{ href, label, scrollTo? }`)
- **Contact SMTP**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL`

## Env Vars

`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL`, `MAINTENANCE_MODE`