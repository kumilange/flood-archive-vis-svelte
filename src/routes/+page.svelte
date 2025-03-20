<script lang="ts">
  import { onMount } from 'svelte';
  import { load } from '@loaders.gl/core';
  import { _GeoJSONLoader as GeoJSONLoader } from '@loaders.gl/json';
  import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
  
  import AreaSelect from '../components/AreaSelect.svelte';
  import Legend from '../components/Legend.svelte';
  import MapContainer from '../components/MapContainer.svelte';
  import LoadingError from '../components/LoadingError.svelte';
  import TimeFilterSlider from '../components/TimeFilterSlider.svelte';
  
  import { DATA_URL, MAP_STYLE } from '../lib/constants';
  import { viewState, timeFilterRange, updateTimeFilter } from '../lib/stores';
  import { getTimeRange, formatLabel,createGeoJsonLayer, handleLoadError, createMapInteractionHandlers } from '../lib/utils';


  // State
  let data: FeatureCollection<Geometry, GeoJsonProperties> | undefined = undefined;
  let timeRange: [number, number] = [0, 0];
  let filterValue: [number, number] = [0, 0];
  let loading = true;
  let error: string | null = null;
  let cursor: string = "grab";
  let hoveredFeatureId: string | null = null;
  let layerId = 'floods-' + Date.now();

  // Use reactive declarations for derived state
  $: currentViewState = $viewState;
  $: {
    if ($timeFilterRange && JSON.stringify(filterValue) !== JSON.stringify($timeFilterRange)) {
      filterValue = $timeFilterRange;
      layerId = 'floods-' + Date.now(); // Force layer recreation
    }
  }
  // Create GeoJSON layer reactively
  $: layers = data ? [createGeoJsonLayer(data, layerId, filterValue, hoveredFeatureId)] : [];

  // Use the utility function to create map interaction handlers
  const { handleHover, handleDragStart, handleDrag, handleDragEnd } = createMapInteractionHandlers(
    (newCursor) => {
      if (newCursor !== cursor) {
        cursor = newCursor;
      }
    },
    (id) => {
      hoveredFeatureId = id;
    }
  );

  // Set error text and loading state
  function setError(message: string) {
    error = message;
  }
  
  function setLoading(isLoading: boolean) {
    loading = isLoading;
  }

  // Handle time filter change from the slider
  function handleTimeFilterChange(newRange: [number, number]) {
    updateTimeFilter(newRange);
    layerId = 'floods-' + Date.now(); // Force layer recreation
  }

  // Load data on component mount
  onMount(async () => {
    try {
      const geojson = await load(DATA_URL, GeoJSONLoader, {
        json: { tableFormat: 'geojson' }
      });

      data = geojson;
      timeRange = getTimeRange(data.features);
      
      // Initialize filter value if not set yet
      if (!$timeFilterRange) {
        filterValue = timeRange;
        updateTimeFilter(timeRange);
      }
      
      loading = false;
    } catch (err) {
      handleLoadError(err, setError, setLoading);
    }
  });
</script>

<main>
  <div class="wrapper">
    <h1 class="heading">Global Active Archive of Large Flood Events, 1985-2021</h1>
    <AreaSelect />
  </div>

  <LoadingError {loading} {error} />

  {#if !loading && !error}
    <MapContainer 
      style={MAP_STYLE}
      viewState={currentViewState}
      {cursor}
      {layers}
      {handleHover}
      {handleDragStart}
      {handleDrag}
      {handleDragEnd}
      customAttribution="Data source: G.R. Brakenridge. Global Active Archive of Large Flood Events. Dartmouth Flood Observatory, University of Colorado, USA."
    />

    <Legend />

    <TimeFilterSlider 
      {timeRange}
      {filterValue}
      {formatLabel}
      onChange={handleTimeFilterChange}
    />
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
</style> 