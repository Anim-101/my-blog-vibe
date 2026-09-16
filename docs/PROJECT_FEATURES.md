# Project Features & Tools Documentation

This document provides a comprehensive summary of all interactive applications, developer tools, and portfolios built within this React/Vite blog workspace.

---

## 🖥️ 1. Interactive Developer Console (Retro Shell)
Located on the homepage, this is a retro-inspired developer terminal (`zsh-sandbox`) styled with hardware-accelerated CRT visual filters.

- **Available Commands**:
  - `ls`, `cd`, `cat`: Explore a virtual Unix directory structure.
  - `neofetch`: Renders Anim Akash's profile summary, local specifications, and credentials.
  - `ansible-playbook playbooks/deploy_skills.yml`: Initiates a color-coded simulation of an Ansible deployment flow.
  - `theme [theme-name]`: Instantly swap terminal skins (e.g., Dracula, Matrix, Cyberpunk, Amber, Solarized, Synthwave).
  - `guestbook [list|sign|clear]`: Recruiter interactive message ledger.
  - `history`, `clear`, `help`: Command logs and shell operations.
- **Embedded Retro Arcade Games**:
  - `snake`: Plays a full keyboard-controlled ASCII Snake game with live scoreboards.
  - `tetris`: Plays a terminal-integrated ASCII Tetris game with gravity drops and high scores.
- **Red Hat Certified Showcase**:
  - Running `sudo rhce` triggers perfect-score (300/300) Red Hat Certified Engineer validation metrics.

---

## 🛡️ 2. Holographic Certification Vault
Located in the **About** section, this is a visual 3D credential management gallery.

- **3D Card Physics**: Hovering over certification cards translates cursor location to 3D matrix rotations, producing dynamic holographic reflections.
- **Verification Cards**: Clicking a card flips it over in 3D, displaying credential IDs, validation issue dates, verified skill sets, and digital badges checking links.
- **Supported Badges**: Red Hat Certified Engineer (RHCE), Red Hat Certified System Administrator (RHCSA), Azure Fundamentals, Azure AI Fundamentals, AWS Solutions Architect, and JLPT N2.
- **Activity Calendars**: Integrates a client-side contribution layout pulling active GitHub commit graphs.

---

## 🔗 3. Data Ingestion Pipeline Simulator
Located in the **Experience** section, this is an interactive node-graph stream mimicking enterprise streaming systems.

- **Data Flow Nodes**: Animates transactional record payloads through CDC logs, validation schema registries, deduplicating filters, compliance masking gateways, stream aggregators, and storage engines (S3, Snowflake, PG Cache).
- **Metric Dashboards**: Live data readouts tracking throughput (msg/s), validation failure alerts, average latency, and Dead Letter Queue (DLQ) logs.
- **Diagnostics**: Clicking any pipeline node highlights the code architecture and Anim's matching Avanade / Business Architects Inc. project implementation history.

---

## 📖 4. Developer Blog & Media Portfolios
- **DevBlog**: Pagination, keyword tags search (`Fuse.js` fuzzy matching), and parsing markdown templates.
- **Photography Gallery**: Clean grid layouts loading structured imagery catalog files.
- **3D Memory Immersive Space**: Dynamic physics-panning photogrid shifts driven by mouse movement or smartphone gyroscopes. Includes a floating glassmorphic lofi background ambient music controller widget playing curated YouTube tracks.

---

## 📂 Codebase Directory Outline

```text
my-blog-vibe/
├── docs/                      # Technical specs and architecture plans
├── src/
│   ├── components/            # Global reusable UI (Navbar, Footer)
│   ├── content/               # Blog and photo Markdown catalogs
│   ├── pages/                 # Main page components
│   │   ├── Home.jsx           # Retro CRT Shell Terminal sandbox
│   │   ├── About.jsx          # Profile details & Holographic Credentials
│   │   ├── Experience.jsx     # Streaming Pipeline simulator
│   │   └── Memory.jsx         # Immersive 3D Space & Music Player
│   ├── tests/                 # Unit test coverage (Vitest + Testing Library)
│   └── i18n.js                # Dual-language translations (EN/JA)
```
