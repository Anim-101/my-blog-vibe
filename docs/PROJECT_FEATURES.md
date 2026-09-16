# Project Features & Tools Documentation

This document provides a comprehensive summary of all applications, developer tools, and portfolios built within this React/Vite blog workspace.

---

## 🛡️ 1. Holographic Certification Vault
Located in the **About** section, this is a visual 3D credential management gallery.

- **3D Card Physics**: Hovering over certification cards translates cursor location to 3D matrix rotations, producing dynamic holographic reflections.
- **Verification Cards**: Clicking a card flips it over in 3D, displaying credential IDs, validation issue dates, verified skill sets, and digital badges checking links.
- **Supported Badges**: Red Hat Certified Engineer (RHCE), Red Hat Certified System Administrator (RHCSA), Azure Fundamentals, Azure AI Fundamentals, AWS Solutions Architect, and JLPT N2.
- **Activity Calendars**: Integrates a client-side contribution layout pulling active GitHub commit graphs.

---

## 📖 2. Developer Blog & Media Portfolios
- **DevBlog**: Pagination, keyword tags search (`Fuse.js` fuzzy matching), and parsing markdown templates.
- **Photography Gallery**: Clean grid layouts loading structured imagery catalog files, including an interactive Japan Travel Constellation Map.
- **3D Memory Immersive Space**: Dynamic physics-panning photogrid shifts driven by mouse movement or smartphone gyroscopes. Includes a floating glassmorphic lofi background ambient music controller widget playing curated YouTube tracks.

---

## 📂 Codebase Directory Outline

```text
my-blog-vibe/
├── docs/                      # Technical specs and architecture plans
├── src/
│   ├── components/            # Global reusable UI (Navbar, Footer, Certifications, Map)
│   ├── content/               # Blog and photo Markdown catalogs
│   ├── pages/                 # Main page components
│   │   ├── Home.jsx           # Landing overview & quick links
│   │   ├── About.jsx          # Profile details, GitHub contribution graph & Holographic Credentials
│   │   ├── Experience.jsx     # Career history & project case studies
│   │   └── Memory.jsx         # Immersive 3D Space & Music Player
│   ├── tests/                 # Unit test coverage (Vitest + Testing Library)
│   └── i18n.js                # Dual-language translations (EN/JA)
```
