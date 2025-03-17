<script lang="ts">
  import { onMount } from 'svelte';
  import { GeoJsonLayer } from '@deck.gl/layers';
  import { DataFilterExtension } from '@deck.gl/extensions';
  import { load } from '@loaders.gl/core';
  import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
  import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
  import { Map } from 'svelte-maplibre-gl';
  import { DeckGLOverlay } from 'svelte-maplibre-gl/deckgl';
  import maplibregl from 'maplibre-gl';

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
    getCursor
  } from '../lib/utils';

  import 'maplibre-gl/dist/maplibre-gl.css';

  // Create a data filter extension for time filtering
  const dataFilter = new DataFilterExtension({
    filterSize: 1,
    fp64: false
  });

  // State
  let data: FeatureCollection<Geometry, GeoJsonProperties> | undefined = undefined;
  let timeRange: [number, number] = [0, 0];
  let filterValue: [number, number] = [0, 0];
  let map: maplibregl.Map | null = null;
  let loading = true;
  let error: string | null = null;
  let currentViewState: any;
  let currentTimeFilterRange: any;

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
        getFillColor: (f: any): [number, number, number] => {
          try {
            const color = generateFillColor(f);
            return color as [number, number, number];
          } catch (error) {
            console.warn('Invalid feature format for color generation', f);
            return [200, 200, 200] as [number, number, number]; // Fallback color
          }
        },
        getLineColor: [0, 0, 0],
        getPointRadius: (f: any) => {
          const area = (f.properties?.Area as number) || 0;
          return Math.sqrt(area) * 100;
        },
        getFilterValue: (f: any) => {
          return f.properties?.timestamp as number;
        },
        filterRange: [filterValue[0], filterValue[1]],
        filterSoftRange: [
          filterValue[0] * 0.9 + filterValue[1] * 0.1,
          filterValue[0] * 0.1 + filterValue[1] * 0.9
        ],
        extensions: [dataFilter],
        lineWidthMinPixels: 1,
        opacity: 0.8
      })]
    : [];

  // Load data on component mount
  onMount(async () => {
    try {
      console.log('Loading data from:', DATA_URL);
      const geojson = await load(DATA_URL, GeoJSONLoader, {
        json: {
          tableFormat: 'geojson'
        }
      });

      console.log('Data loaded successfully:', geojson);
      data = geojson;
      timeRange = getTimeRange(data.features);
      console.log('Time range:', timeRange);
      
      // Initialize filter value if not set yet
      if (!currentTimeFilterRange) {
        filterValue = timeRange;
        console.log('Filter value initialized:', filterValue);
      }
      
      loading = false;
    } catch (err) {
      console.error('Error loading data:', err);
      error = 'Error loading flood data. Please try again later.';
      loading = false;
    }
  });

  // Handle time filter change
  function handleTimeFilterChange(newRange: [number, number]) {
    console.log('Time filter changed:', newRange);
    updateTimeFilter(newRange);
  }
</script>

<main>
  <div class="wrapper">
    <h1 class="heading">Global Active Archive of Large Flood Events, 1985-2021</h1>
    <AreaSelect />
  </div>

  {#if loading}
    <div class="loading">Loading data...</div>
  {:else if error}
    <div class="error" role="alert" aria-live="assertive">{error}</div>
  {:else}
    <Map
      bind:map
      style={MAP_STYLE}
      center={[currentViewState?.longitude || 0, currentViewState?.latitude || 0]}
      zoom={currentViewState?.zoom || 2}
    >
      {#if layers.length > 0}
        <DeckGLOverlay 
          {layers}
          getTooltip={getTooltip}
          getCursor={getCursor}
        />
      {/if}
      
      <!-- Attribution control added separately to avoid compatibility issues -->
      <div class="attribution">
        Data source: G.R. Brakenridge. Global Active Archive of Large Flood Events. Dartmouth Flood Observatory, University of Colorado, USA.
      </div>
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
  }

  .error {
    color: red;
  }

  .attribution {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 5px 10px;
    margin: 0;
    font-size: 11px;
    line-height: 1.5;
    color: #333;
    z-index: 1;
  }

  :global(.maplibregl-map) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
</style> 