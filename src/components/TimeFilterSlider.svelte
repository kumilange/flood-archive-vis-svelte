<script lang="ts">
  import RangeSlider from './RangeSlider.svelte';
  
  export let timeRange: [number, number];
  export let filterValue: [number, number];
  export let formatLabel: (timestamp: number) => string;
  export let onChange: (range: [number, number]) => void;
</script>

{#if timeRange && timeRange[0] !== timeRange[1]}
  <div class="slider">
    <RangeSlider
      min={timeRange[0]}
      max={timeRange[1]}
      value={filterValue}
      {formatLabel}
      {onChange}
    />
  </div>
{/if}

<style>
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
</style> 