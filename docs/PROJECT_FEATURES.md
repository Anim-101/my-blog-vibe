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

## 🕹️ 4. Tools Workspace Dashboard (`/tools`)
A unified developer workspace housing 5 custom-built sandboxes and utilities.

### A. Cloud Infrastructure Designer (`/tools/designer`)
A drag-and-drop system topology modeler.
- **Visual Canvas**: Drag cloud nodes (EC2, S3, RDS, Route53, VPN Gateways, VMs, Azure SQL) onto a coordinate-based architecture board, wire connections, and configure properties.
- **IaC Export Engine**: Generates production-ready Terraform scripts or Ansible configuration files dynamically matching the active canvas layout.
- **Design Auditor**: Runs real-time safety checks warning users of unmapped load balancers, public databases, or open S3 buckets.
- **Bill Estimator**: Calculates real AWS/Azure pricing metrics per hour/month.

### B. Generative AI Agent Sandbox (`/tools/agents`)
A tool to visualize agentic decision workflows.
- **Workflow Node Builder**: Drag and drop LLM components, long-term memory buffers, and action tools (Web search, code execution).
- **Reasoning Log Console**: Simulates multi-turn prompts showing prompt routing logs, thinking delays, tool calls, and final responses.
- **Code Snippet Exporter**: Outputs configuration templates for Semantic Kernel and LangChain.

### C. Multi-Language Code Compiler (`/tools/compiler`)
An editor supporting 5 environments.
- **Python Simulator**: Execute loops, Fibonacci recursions, and variables prints locally.
- **JavaScript Sandboxed Shell**: Evaluate scripts against localized mock consoles.
- **Web Live Preview (HTML/CSS)**: Render tags inside visual mock-browser iframes, complete with dynamic address bars.
- **SQL Mock Engine**: Clean comment strings (`--`), create schemas, run `INSERT` statements, and render queries into grid-aligned table columns.
- **Markdown Live Preview**: Parse bold tags, inline blocks, code blocks, lists, and header levels, rendering formatted pages inside active iframe panes.

### D. Git Branching Sandbox (`/tools/git`)
A graphical Git branch simulator.
- **Graph Tree Vis**: Renders commits, branches, merges, detaches, and tags as dynamic visual canvas nodes.
- **Git Console Shell**: Run commands (`git commit`, `git checkout`, `git branch`, `git merge`, `git rebase`) and watch the graph update.
- **Branch Challenge Levels**: Renders puzzles (levels 1-5) where users must execute correct commands to match target graph trees.

### E. REST API Client Simulator (`/tools/api`)
A browser-based API testing utility (Postman emulator).
- **Request Formatter**: Select HTTP verbs (GET, POST, PUT, DELETE, PATCH), build request header arrays, and modify JSON bodies.
- **Latency & Size Metrics**: Computes round-trip response delays in ms and sizes in KB.
- **Dynamic CORS Warning Intercepts**: Blocks network fetch errors with clean alert modals, offering users to simulate structured mock response values instead.

---

## 📖 5. Developer Blog & Media Portfolios
- **DevBlog**: Pagination, keyword tags search (`Fuse.js` fuzzy matching), and parsing markdown templates.
- **Photography Gallery**: Clean grid layouts loading structured imagery catalog files.
- **3D Memory Immersive Space**: Dynamic physics-panning photogrid shifts driven by mouse movement or smartphone gyroscopes. Includes a floating glassmorphic lofi background ambient music controller widget playing curated YouTube tracks.

---

## 📂 Codebase Directory Outline

```text
my-blog-vibe/
├── docs/                      # Technical specs and architecture plans
├── src/
│   ├── components/            # Global reusable UI (Navbar, Footer, Copilot)
│   ├── content/               # Blog and photo Markdown catalogs
│   ├── pages/                 # Main page components
│   │   ├── Home.jsx           # Retro CRT Shell Terminal sandbox
│   │   ├── About.jsx          # Profile details & Holographic Credentials
│   │   ├── Experience.jsx     # Streaming Pipeline simulator
│   │   ├── Memory.jsx         # Immersive 3D Space & Music Player
│   │   ├── Infrastructure.jsx # Cloud Designer grid canvas
│   │   ├── Agents.jsx         # GenAI Agent assembler
│   │   ├── Compiler.jsx       # Multi-language Online Compiler
│   │   ├── GitVisualizer.jsx  # Git branching playground
│   │   └── ApiClient.jsx      # REST API Client simulator
│   ├── tests/                 # Unit test coverage (Vitest + Testing Library)
│   └── i18n.js                # Dual-language translations (EN/JA)
```
