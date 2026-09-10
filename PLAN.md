# DigitalCV — Implementation Plan

Personal 3D interactive portfolio for **Jeevan** (Full-Stack Web Developer, MCA), built strictly from
`JEEVAN.pdf` / `JEEVAN_resume.docx` and verified public data on `github.com/Jeevan2410`.

## Technology Stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite 7 + React 19 (JavaScript/JSX) | Fast build, matches Jeevan's JS skill set (maintainable by him), deploys to Vercel like his existing repos |
| 3D | three + @react-three/fiber (no drei) | Lean bundle; all 3D is procedural (zero asset downloads) |
| Motion | framer-motion | Scroll reveals, page choreography, layout transitions |
| Styling | Hand-written CSS (custom properties) | Full design-system control, no framework bloat |
| Data | Static `src/data/*.js` + live GitHub REST (unauthenticated) | No API keys, no secrets, graceful fallback |

## Page Structure (single-page, section-anchored)

Preloader → Nav → Hero → About → Skills → Experience → Projects → Education → Certifications → GitHub → Contact → Footer

Only sections supported by the resume are included. No fake stats/testimonials.

## Component Architecture

```
src/
  data/profile.js          ← single source of truth for every resume fact
  data/projects.js         ← featured projects (resume-verified only)
  data/repos-fallback.js   ← curated repo list if GitHub API is rate-limited
  hooks/                   ← useReducedMotion, useKonami, useGitHubRepos, useInView…
  three/                   ← SceneCanvas (fixed bg), IdentityCore, Starfield, SkillsConstellation
  components/              ← Preloader, Nav, Hero, About, Skills, Experience, Projects,
                             ProjectDetail, Education, Certifications, GitHubSection,
                             Contact, Footer, Terminal, DevMode, ConnectFour, MatrixRain,
                             CustomCursor, Toast, SectionHeading
  styles/global.css        ← design tokens + all styles
```

## 3D Strategy

- **One fixed background canvas** (behind content, `pointer-events:none`): particle starfield +
  procedural "Identity Core" (wireframe icosahedron shell, emissive core, orbiting stack-node rings).
- Mouse parallax on camera; click in hero = rotation impulse; **hovering a project re-lights the scene**
  (accent state → point light + fog color). Scroll drifts camera and recedes the core.
- **Skills constellation**: second, lazy-mounted in-section canvas (desktop, in-view only) — tech as
  glowing nodes grouped by resume category, hover tooltip. Mobile/reduced-motion → static chips.
- Both canvases: clamped DPR, reduced particle counts on mobile, render pause when hidden/offscreen.
- **WebGL failure → graceful CSS-gradient fallback** (feature-detect before mounting Canvas).

## Animation Strategy

Framer Motion `whileInView` reveals (staggered), custom cubic-bezier(0.22,1,0.36,1), scroll progress
bar, hero entrance choreography after preloader, magnetic hover on CTAs, micro-interactions on cards.
`prefers-reduced-motion` → instant reveals, static 3D frame, no auto-rotation.

## Easter Eggs (tasteful, non-blocking)

1. **Konami code** (↑↑↓↓←→←→BA) → short Matrix-rain overlay + toast.
2. **Hidden terminal** — `~` key or the `>_` glyph in footer; factual commands: help, whoami, about,
   skills, projects, experience, education, certs, contact, github, goto <section>, clear, exit.
3. **Developer mode** — terminal command `dev` → HUD overlay: active section, FPS, device pixel ratio,
   reduced-motion state, accent state. No sensitive info.
4. **Hidden project** — terminal command `play` (or Konami? no — `play`) launches a playable mini
   **Connect 4** (a real, verified repo: `Jeevan2410/Connect-4-game`) with repo link.
5. **Cursor interaction** — custom cursor + click particle bursts; long-press reveals rotating
   "developer fact" captions (all factual).

## GitHub Presentation

- Featured projects (Happy Tails, Library Analytics) rendered from resume text only — no repo links
  where none exist publicly ("repository not publicly available" noted once, honestly).
- GitHub section fetches `api.github.com/users/Jeevan2410/repos` client-side (public, unauthenticated),
  filters forks, shows name/language/description/demo links + "live" badge; falls back to the verified
  static list on failure. No fabricated stars or stats.

## Responsive / A11y / SEO / Performance

- Mobile: reduced 3D (particle count, DPR, constellation→chips), intentional stacked layouts, custom
  cursor disabled on touch, no horizontal overflow.
- A11y: semantic landmarks, skip-link, focus-visible, focus-trapped modal, aria-labels, 3D is
  decorative (aria-hidden) — every fact is plain text, AA contrast on dark bg.
- SEO: title/meta/OG/Twitter, SVG favicon, theme-color, JSON-LD `Person` (factual only).
- Perf: `React.lazy` for 3D + terminal + modal, manual chunk splitting (three / framer-motion),
  preconnected fonts with `display=swap`, no image assets except generated favicon/OG PNG.

## Deployment

`npm run build` → static `dist/` → Vercel (matches the existing `digital-cv-mu-dun.vercel.app` /
`Jeevan2410/Digital-CV` repo). Resume PDF ships as `public/resume.pdf` for the "Résumé" CTA.
