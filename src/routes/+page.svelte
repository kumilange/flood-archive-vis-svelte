<script lang="ts">
  import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
  import AreaSelect from '../components/AreaSelect.svelte';
  import Legend from '../components/Legend.svelte';
  import MapContainer from '../components/MapContainer.svelte';
  import RangeSlider from '../components/RangeSlider.svelte';
  
  import { timeFilterRange, updateTimeFilter } from '../lib/stores';
  import { getTimeRange, formatLabel, createFloodLayer } from '../lib/utils';

  // Props
  const props = $props<{
    data: FeatureCollection<Geometry, GeoJsonProperties>}>();

  // Derived values
  let timeRange = $derived(getTimeRange(props.data.features));
  let filterValue = $derived($timeFilterRange || timeRange);
  let layers = $derived([createFloodLayer(props.data, filterValue)]);
</script>

<main>
  <div class="wrapper">
    <h1 class="heading">Global Active Archive of Large Flood Events, 1985-2021</h1>
    <AreaSelect />
  </div>

  <MapContainer {layers}/>

  <Legend />
  <RangeSlider 
    min={timeRange[0]}
    max={timeRange[1]}
    value={filterValue}
    formatLabel={formatLabel}
    onChange={updateTimeFilter}
  />
</main>

<style>
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

  .heading {
    text-align: center;
    font-weight: 700;
    color: var(--primary);
    margin-right: 16px;
  }
</style> 