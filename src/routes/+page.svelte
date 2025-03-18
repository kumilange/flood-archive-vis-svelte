<script lang="ts">
  import { onMount } from 'svelte';
  import { GeoJsonLayer } from '@deck.gl/layers';
  import { DataFilterExtension } from '@deck.gl/extensions';
  import { load } from '@loaders.gl/core';
  import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
  import type { FeatureCollection, Geometry, GeoJsonProperties, Feature } from 'geojson';
  import { Map, AttributionControl } from 'svelte-maplibre-gl';
  import { DeckGLOverlay } from 'svelte-maplibre-gl/deckgl';

  import AreaSelect from '../components/AreaSelect/AreaSelect.svelte';
  import Legend from '../components/Legend/Legend.svelte';
  import RangeSlider from '../components/RangeSlider/RangeSlider.svelte';
  import { DATA_URL, MAP_STYLE } from '../lib/constants';
  import { viewState, timeFilterRange, updateTimeFilter } from '../lib/stores';
  import {
    formatLabel,
    generateFillColor,
    getTimeRange,
    getTooltip,
    setCursor
  } from '../lib/utils';

  // Create a data filter extension for time filtering
  const dataFilter = new DataFilterExtension({
    filterSize: 1,
    fp64: true
  });

  // State
  let data: FeatureCollection<Geometry, GeoJsonProperties> | undefined = undefined;
  let timeRange: [number, number] = [0, 0];
  let filterValue: [number, number] = [0, 0];
  let loading = true;
  let error: string | null = null;
  let currentViewState: any;
  let currentTimeFilterRange: any;
  let cursor: string = "grab";
  let hoveredFeatureId: string | null = null;

  // Subscribe to stores
  viewState.subscribe(value => {
    currentViewState = value;
  });

  timeFilterRange.subscribe(value => {
    currentTimeFilterRange = value;
    if (value) {
      filterValue = value;
    }
  });

  // Create GeoJSON layer for flood data visualization
  $: layers = data
    ? [new GeoJsonLayer({
        id: 'floods',
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
        filterRange: [filterValue[0], filterValue[1]],
        filterSoftRange: [
          filterValue[0] * 0.9 + filterValue[1] * 0.1,
          filterValue[0] * 0.1 + filterValue[1] * 0.9
        ],
        extensions: [dataFilter],
        lineWidthMinPixels: 0.5,
        opacity: 0.8
      })]
    : [];

  // Load data on component mount
  onMount(async () => {
    try {
      const geojson = await load(DATA_URL, GeoJSONLoader, {
        json: {
          tableFormat: 'geojson'
        }
      });

      data = geojson;
      timeRange = getTimeRange(data.features);
      
      // Initialize filter value if not set yet
      if (!currentTimeFilterRange) {
        filterValue = timeRange;
      }
      
      loading = false;
    } catch (err) {
      console.error('Error loading data:', err);
      
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object') {
        const response = err.response as { status: number; statusText: string; json(): Promise<unknown> };
        console.error('Response status:', response.status);
        console.error('Response data:', await response.json());
        error = `Error loading flood data: ${response.status} - ${response.statusText}. Please check the console for more details.`;
      } else {
        error = 'Error loading flood data. Please try again later.';
      }
      
      loading = false;
    }
  });

  // Handle time filter change
  function handleTimeFilterChange(newRange: [number, number]) {
    updateTimeFilter(newRange);
  }

  function updateCursor(info: { object?: any }, isDragging: boolean = false) {
    hoveredFeatureId = info?.object?.id || null;
    
    const currentCursor = setCursor(info, isDragging);
    if (currentCursor !== cursor) {
      cursor = currentCursor;
    }
  }
</script>

<main>
  <div class="wrapper">
    <h1 class="heading">Global Active Archive of Large Flood Events, 1985-2021</h1>
    <AreaSelect />
  </div>

  {#if loading}
  <div class="loading" role="status" aria-live="polite">
    <div class="loading-spinner"></div>
    <span>Loading data...</span>
  </div>
  {:else if error}
  <div class="error" role="alert" aria-live="assertive">
    <span class="error-icon">⚠️</span>
    <span>{error}</span>
  </div>
  {:else}
    <Map
      style={MAP_STYLE}
      center={[currentViewState?.longitude || 0, currentViewState?.latitude || 0]}
      zoom={currentViewState?.zoom || 2}
      attributionControl={false}
      cursor={cursor}
    >
      {#if layers.length > 0}
        <DeckGLOverlay 
          {layers}
          getTooltip={getTooltip}
          onHover={(info) => updateCursor(info)}
          onDragStart={(info) => updateCursor(info, true)}
          onDrag={(info) => updateCursor(info, true)}
          onDragEnd={(info) => updateCursor(info, false)}
        />
      {/if}
      
      <AttributionControl
        customAttribution="Data source: G.R. Brakenridge. Global Active Archive of Large Flood Events. Dartmouth Flood Observatory, University of Colorado, USA."
      />
    </Map>

    <Legend />

    {#if timeRange && timeRange[0] !== timeRange[1]}
      <div class="slider">
        <RangeSlider
          min={timeRange[0]}
          max={timeRange[1]}
          value={filterValue}
          {formatLabel}
          onChange={handleTimeFilterChange}
        />
      </div>
    {/if}
  {/if}
</main>

<style>
  .heading {
    text-align: center;
    font-weight: 700;
    color: var(--primary);
    margin-right: 16px;
  }

  .wrapper {
    position: fixed;
    top: 0;
    left: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .slider {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    bottom: 44px;
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 30px 6px 8px;
    border: 1px solid var(--transparent);
    background-color: var(--transparent);
    border-radius: 4px;
  }

  .loading,
  .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }


  .error {
    color: red;
  }

  .error-icon {
    font-size: 24px;
  }

  :global(.maplibregl-map) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }

  :global(.maplibregl-ctrl-attrib-inner) {
    font-family: var(--text-font);
    font-size: 12px;
    color: #000;
  }
</style> 