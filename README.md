# 🌀 Flood Archive Visualization 🗺️

## ⚠️ Note

This project is a rewrite in `Svelte` of the `React` app [flood-archive-vis-react](https://github.com/kumilange/flood-archive-vis-react). It was completed by **Cursor** and **Claude-3.7-Sonnet** in 4 hours, along with a few cosmetic touch-ups that took an additional 4 hours.

## 📖 Introduction

[![Flood Archive Vis](https://github.com/user-attachments/assets/5249e9ee-f05f-4ed6-9226-6f16ab4f6638)](https://github.com/user-attachments/assets/5249e9ee-f05f-4ed6-9226-6f16ab4f6638)

This project visualizes the Global Active Archive of Large Flood Events data from 1985 to 2021, utilizing interactive maps and time-based filtering to explore historical flood events around the globe.

## ✨ Features

- Interactive map visualization of global flood events
- Time-based filtering with animation capabilities
- Geographic area selection for focused exploration
- Color-coded visualization based on death toll
- Detailed tooltips with flood event information

## 🛠️ Technologies Used

- **Svelte** - UI framework [Svelte Documentation](https://svelte.dev/)
- **TypeScript** - Type-safe JavaScript [TypeScript Documentation](https://www.typescriptlang.org/)
- **deck.gl** - WebGL-powered visualization framework [deck.gl Documentation](https://deck.gl/)
- **MapLibre GL** - Open-source map rendering [MapLibre GL Documentation](https://maplibre.org/)
- **Svelte MapLibre GL** - Svelte 5 wrapper for MapLibre GL JS [Svelte MapLibre GL Documentation](https://svelte-maplibre-gl.mierune.dev/docs/quickstart)
- **Svelte Stores** - State management [Svelte Stores Documentation](https://svelte.dev/docs#svelte_store)

## 📥 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kumilange/flood-archive-vis-svelte.git
   cd flood-archive-vis-svelte
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 💻 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint
- `npm run check` - Type-check with TypeScript

## 📂 Project Structure

```text
flood-archive-vis/
├── src/                 # Source code
│   ├── assets/          # Image assets
│   ├── components/      # Svelte components
│   │   ├── AreaSelect/  # Geographic area selection
│   │   ├── Legend/      # Map legend component
│   │   └── RangeSlider/ # Time range slider
│   ├── styles/          # Global styles
│   ├── routes/          # Svelte routes
│   └── lib/             # Library code & utilities
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc.json     # Prettier configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 📊 Data Source

This application uses data from the [Dartmouth Flood Observatory](https://floodobservatory.colorado.edu/), University of Colorado, maintained by G.R. Brakenridge. The Global Active Archive of Large Flood Events documents major flood events worldwide from 1985 to the present.

**Citation:** G.R. Brakenridge. Global Active Archive of Large Flood Events. Dartmouth Flood Observatory, University of Colorado, USA. [http://floodobservatory.colorado.edu/Archives/](http://floodobservatory.colorado.edu/Archives/)
