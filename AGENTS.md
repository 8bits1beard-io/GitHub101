# GitHub 101 Agent Guide

## Purpose
This repo is a static, single-page web app that teaches Git/GitHub fundamentals with interactive lessons, simulations, and a final assessment that generates a completion certificate.

## Entry Points
- `index.html` - Main document with all tutorial content and section layout.
- `styles.css` - Global styling, layout, and component styles.
- `script.js` - All client-side behavior: navigation, simulations, quizzes, and certificate generation.
- `manifest.json` - PWA metadata for installable experience.

## How It Works
- Navigation is section-based (`intro`, `setup`, `repositories`, `basics`, `branching`, `collaboration`, `advanced`, `best-practices`, `final-quiz`) with sidebar links and "next/previous" controls.
- Interactive demos are simulated in the DOM (terminal output, drag-and-drop staging area, workflow simulation).
- The quiz picks 20 questions from a 100-question bank, shuffles them, tracks answers, and computes pass/fail (80%).
- Certificates are generated on the client with HTML templates and downloaded as PDF via `jspdf`.

## State + Storage
- Theme is stored in `localStorage` under `theme`.
- Progress is stored in `localStorage` under `github-tutorial-progress` (section index).
- Quiz state is held in memory; results are shown inline after submission.

## External Dependencies
- CDN assets in `index.html`: Prism (syntax highlighting) and jsPDF (certificate export).
- Google Fonts in `styles.css`.
- `manifest.json` and `index.html` reference images in `./assets/` (icons/screenshots).

## Development Notes
- There is no build step; open `index.html` directly or serve with any static server.
- Most logic lives in `script.js`; new features should keep DOM structure and IDs in sync with HTML.
- Styles use CSS variables in `:root` for theming and spacing.
