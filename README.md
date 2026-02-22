# Anim Akash - Personal Portfolio & Blog

Welcome to the repository for my personal portfolio and blog! This project serves as a central hub to showcase my experience, technical writing, and photography journey.

## About the Project

This is a modern, responsive web application built with a focus on high performance, lean architecture, and a uniquely crafted aesthetic. It uses a sleek "glassmorphism" design system and relies entirely on Vanilla CSS for styling to maximize flexibility and control.

### Key Features

- **Personal Portfolio:** Detailed experience, current role, and tech focus areas (Cloud Architecture, Blockchain, LLMs).
- **About Me:** An interactive profile overview featuring a real-time GitHub commit history calendar (`react-github-calendar`).
- **Dev Blog:** A custom markdown-based technical blog showcasing my engineering journey and thoughts.
- **Photography Gallery:** A rich visual layout featuring a directory-organized collection of my photography from around the world.
- **Markdown Driven Content:** Content for the blog and photography logs is easily managed locally via Markdown files with YAML frontmatter.

## Technologies Used

- **Core:** React, Vite
- **Styling:** Vanilla CSS (Custom Tokens, Next-Gen Hover Effects, Glassmorphism)
- **Routing:** React Router v7 (`react-router-dom`)
- **Content Parsing:** Markdown (`front-matter`, `react-markdown`, `remark-gfm`)
- **Icons:** Lucide-React (`lucide-react`)

## Running Locally

To get a local copy up and running, follow these simple steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Anim-101/my-blog-vibe.git
   cd my-blog-vibe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Deployment

This app is optimized for seamless CI/CD deployment to front-end platforms like **Vercel** or **Netlify**. 

*Note: All static assets like images are stored and served automatically from the `/public` directory to ensure they resolve beautifully in production environments!*

---
*Developed by [Anim Akash](https://github.com/Anim-101)*
