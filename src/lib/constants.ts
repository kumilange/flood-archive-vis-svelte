import { DataFilterExtension } from '@deck.gl/extensions';

// Map style and data URL
export const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const INITIAL_VIEW_STATE = {
  longitude: 0.0098,
  latitude: 20.4934,
  zoom: 2,
};

export const DATA_URL =
  "https://kumilange.github.io/data-store/flood/floodArchive.geojson";

export const DATA_FILTER = new DataFilterExtension({
  filterSize: 1,
  fp64: true,
});


// Area definitions for the map
export type Area = {
  label: string;
  boundary: [[number, number], [number, number]];
  zoom: number;
};

export const AREAS: Record<string, Area> = {
  all: {
    label: "World",
    boundary: [
      [-180, -90],
      [180, 90],
    ],
    zoom: 1,
  },
  europe: {
    label: "Europe",
    boundary: [
      [-10.3963, 34.611],
      [41.5541, 68.676],
    ],
    zoom: 3,
  },
  africa: {
    label: "Africa",
    boundary: [
      [-17.5232, -34.8192],
      [51.4197, 37.345],
    ],
    zoom: 3,
  },
  oceania: {
    label: "Oceania",
    boundary: [
      [110.9513, -52.8214],
      [179.9999, -9.2211],
    ],
    zoom: 4,
  },
  namerica: {
    label: "North America",
    boundary: [
      [-145.1200428, 3.4727219],
      [-57.7411366, 70.9463906],
    ],
    zoom: 4,
  },
  samerica: {
    label: "South America",
    boundary: [
      [-81.326, -56.073],
      [-34.365, 12.461],
    ],
    zoom: 3.5,
  },
  northasia: {
    label: "North Asia",
    boundary: [
      [40.1824, 41.1851],
      [169.8669, 81.8574],
    ],
    zoom: 3,
  },
  centralasia: {
    label: "Central Asia",
    boundary: [
      [46.4657, 37.3841],
      [87.3152, 55.4551],
    ],
    zoom: 4,
  },
  eastasia: {
    label: "East Asia",
    boundary: [
      [100.115, 20.6172],
      [145.575, 53.5587],
    ],
    zoom: 4,
  },
  westasia: {
    label: "West Asia",
    boundary: [
      [34.9206, 12.5861],
      [63.3333, 45.5486],
    ],
    zoom: 4,
  },
  southasia: {
    label: "South Asia",
    boundary: [
      [60.8786, 5.9657],
      [97.3447, 35.6745],
    ],
    zoom: 4,
  },
  southeastasia: {
    label: "Southeast Asia",
    boundary: [
      [92.1934, -11.0084],
      [155.2243, 28.5478],
    ],
    zoom: 4,
  },
};

// Generate area select options
const generateAreaOptions = (areas: Record<string, Area>) => {
  const continentGroups = [
    {
      label: "America",
      title: "America",
      options: Object.keys(areas)
        .filter((key) => key.includes("america"))
        .map((area) => ({ value: area, label: areas[area]?.label })),
    },
    {
      label: "Asia",
      title: "Asia",
      options: Object.keys(areas)
        .filter((key) => key.includes("asia"))
        .map((area) => ({ value: area, label: areas[area]?.label })),
    },
  ];

  const individualAreas = Object.keys(areas)
    .filter((key) => !key.includes("america") && !key.includes("asia"))
    .map((key) => ({ value: key, label: areas[key]?.label }));

  return [...individualAreas, ...continentGroups];
};

export const AREA_SELECT_OPTIONS = generateAreaOptions(AREAS);

