import { GeoJsonLayer } from '@deck.gl/layers';
import { DataFilterExtension } from '@deck.gl/extensions';
import type { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson';

// Color constants for flood visualization based on death toll
const COLOR_RANGE: number[][] = [
  [239, 243, 255],
  [198, 219, 239],
  [158, 202, 225],
  [107, 174, 214],
  [49, 130, 189],
  [8, 81, 156],
];

/**
 * Format a timestamp into a human-readable date string
 * @param timestamp - The timestamp to format
 * @returns A formatted date string in the format MM/DD/YYYY
 */
export function formatLabel(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    timeZone: "utc",
    year: "numeric",
    month: "2-digit",
  });
}

/**
 * Calculate the time range for a set of features
 * @param features - Array of GeoJSON features
 * @returns A tuple with the minimum and maximum timestamps
 */
export function getTimeRange(
  features?: Feature<Geometry, GeoJsonProperties>[],
): [number, number] {
  if (!features || features.length === 0) {
    return [0, 0];
  }

  const [minTime, maxTime] = features.reduce(
    (range, f) => {
      const t = f?.properties?.["timestamp"] ?? null;
      if (typeof t === "number") {
        range[0] = Math.min(range[0], t);
        range[1] = Math.max(range[1], t);
      }
      return range;
    },
    [Infinity, -Infinity],
  );

  return minTime === Infinity || maxTime === -Infinity
    ? [0, 0]
    : [minTime, maxTime];
}


/**
 * Generates a fill color for a flood feature based on the death toll
 * @param f - GeoJSON feature with flood data
 * @returns A color from the color range
 */
export function generateFillColor(
  f: Feature<Geometry, GeoJsonProperties>,
): [number, number, number] {
  const deathToll: number = f.properties?.["Dead"] || 0;
  let index = 0;

  if (deathToll > 0 && deathToll <= 10) {
    index = 1;
  } else if (deathToll > 10 && deathToll <= 50) {
    index = 2;
  } else if (deathToll > 50 && deathToll <= 100) {
    index = 3;
  } else if (deathToll > 100 && deathToll <= 1000) {
    index = 4;
  } else if (deathToll > 1000) {
    index = 5;
  }

  // Ensure we have a valid index and return a properly typed color
  const colorArray = COLOR_RANGE[index];
  return colorArray && colorArray.length >= 3
    ? (colorArray.slice(0, 3) as [number, number, number])
    : [200, 200, 200];
}

// Create a data filter extension for time filtering
const dataFilter = new DataFilterExtension({
  filterSize: 1,
  fp64: true
});

// Interface for flood properties
interface FloodProperties {
  Dead: number;
  Area: number;
  Country: string;
  timestamp: number;
  [key: string]: number | string;
}

interface PickingInfo {
  object?: any;
  isHovering?: boolean;
}

/**
 * Generate tooltip content for a flood feature
 * @param info - Picking info from deck.gl
 * @returns Tooltip content or null if no object is hovered
 */
export function getTooltip(
  info: PickingInfo,
): { text: string; style: object } | null {
  const { object } = info;
  if (!object) return null;

  const properties = object.properties as FloodProperties;
  const { Dead, Area, Country, timestamp } = properties;

  return {
    text: `\
    Country: ${Country}
    Date: ${formatLabel(timestamp)}
    Death: ${Dead}
    Area: ${Area} sq km
    `,
    style: {
      zIndex: "2",
      backgroundColor: "white",
      color: "#08519c",
      border: "2px solid #08519c",
      borderRadius: "4px",
    },
  };
}

/**
 * Creates a GeoJsonLayer for flood data visualization
 */
export function createGeoJsonLayer(
  data: FeatureCollection<Geometry, GeoJsonProperties> | undefined,
  id: string,
  currentFilterValue: [number, number],
  hoveredFeatureId: string | null
) {
  if (!data) return null;

  return new GeoJsonLayer({
    id,
    data,
    filled: true,
    pickable: true,
    autoHighlight: true,
    highlightColor: [255, 255, 100, 150],
    getFillColor: (f: Feature<Geometry, GeoJsonProperties>): [number, number, number] => {
      try {
        const color = generateFillColor(f);
        if (hoveredFeatureId && f.id === hoveredFeatureId) {
          return [255, 255, 100] as [number, number, number];
        }
        return color as [number, number, number];
      } catch (error) {
        console.warn('Invalid feature format for color generation', f);
        return [200, 200, 200] as [number, number, number]; // Fallback color
      }
    },
    getLineColor: [0, 0, 0, 50],
    getPointRadius: (f: Feature<Geometry, GeoJsonProperties>) => {
      const area = (f.properties?.['Area'] as number) || 0;
      return Math.sqrt(area) * 100;
    },
    getFilterValue: (f: Feature<Geometry, GeoJsonProperties>) => {
      return f.properties?.['timestamp'] as number;
    },
    filterRange: [currentFilterValue[0], currentFilterValue[1]],
    filterSoftRange: [
      currentFilterValue[0] * 0.9 + currentFilterValue[1] * 0.1,
      currentFilterValue[0] * 0.1 + currentFilterValue[1] * 0.9
    ],
    extensions: [dataFilter],
    lineWidthMinPixels: 0.5,
    opacity: 0.8
  });
}

/**
 * A factory function that creates event handlers for map interactions.
 * @param setCursorValue - A function that updates the cursor style.
 * @param setHoveredFeature - A function that updates the ID of the hovered feature.
 * @returns An object containing all the event handlers needed for the map.
 */
export function createMapInteractionHandlers(
  setCursorValue: (cursor: string) => void,
  setHoveredFeature: (featureId: string | null) => void
) {
  /**
   * Updates the hovered feature ID and cursor style.
   */
  function handleInteraction(info: { object?: { id?: string } }, isDragging: boolean) {
    const featureId = info?.object?.id || null;
    setHoveredFeature(featureId);

    let newCursor = 'grab';
    if (info?.object) {
      newCursor = 'pointer';
    } else if (isDragging) {
      newCursor = 'grabbing';
    }

    setCursorValue(newCursor);
  }

  return {
    handleHover: (info: any) => handleInteraction(info, false),
    handleDragStart: (info: any) => handleInteraction(info, true),
    handleDrag: (info: any) => handleInteraction(info, true),
    handleDragEnd: (info: any) => handleInteraction(info, false)
  };
}

/**
 * Handle data loading errors
 */
export function handleLoadError(err: any, setError: (msg: string) => void, setLoading: (isLoading: boolean) => void) {
  console.error('Error loading data:', err);

  if (err?.response) {
    const response = err.response as { status: number; statusText: string; json(): Promise<unknown> };
    console.error('Response status:', response.status);

    // Handle JSON parsing with a promise instead of await
    response.json()
      .then(data => console.error('Response data:', data))
      .catch(jsonErr => console.error('Failed to parse response JSON:', jsonErr))
      .finally(() => {
        setError(`Error loading flood data: ${response.status} - ${response.statusText}. Please check the console for more details.`);
      });
  } else {
    setError('Error loading flood data. Please try again later.');
  }

  setLoading(false);
}