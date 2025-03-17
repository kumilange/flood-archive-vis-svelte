# Global Active Archive of Large Flood Events

This is a Svelte 5 application that visualizes the Global Active Archive of Large Flood Events from 1985-2021. The application uses MapLibre GL for map rendering and Deck.gl for data visualization.

## Features

- Interactive map visualization of global flood events
- Time-based filtering with animation capabilities
- Geographic area selection
- Color-coded visualization based on death toll
- Detailed tooltips with flood information

## Technologies Used

- Svelte 5 with runes for state management
- MapLibre GL for map rendering
- Deck.gl for data visualization
- TypeScript for type safety
- SCSS for styling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the application for production, run:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Data Source

The flood data is sourced from the Dartmouth Flood Observatory, University of Colorado, USA. The dataset includes information about large flood events worldwide from 1985 to 2021, including location, date, death toll, and affected area.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- G.R. Brakenridge for the Global Active Archive of Large Flood Events dataset
- The Svelte team for the excellent framework
- The MapLibre GL and Deck.gl teams for their visualization libraries 