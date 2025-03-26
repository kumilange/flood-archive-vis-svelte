<script lang="ts">
  import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
  import AreaSelect from '../components/AreaSelect.svelte';
  import Legend from '../components/Legend.svelte';
  import MapContainer from '../components/MapContainer.svelte';
  import RangeSlider, { type RangeValues } from '../components/RangeSlider.svelte';
  import { getTimeRange, createFloodLayer } from '../lib/utils';

  const props = $props<{
    data: FeatureCollection<Geometry, GeoJsonProperties>}>();
  let timeRange = getTimeRange(props.data.features);
  let rangeValues = $state(timeRange);
  let layers = $derived([createFloodLayer(props.data, rangeValues)]);

  function handleRangeChange(newRanges: RangeValues) {
    rangeValues = newRanges;
  }
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
    values={rangeValues}
    onChange={handleRangeChange}
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