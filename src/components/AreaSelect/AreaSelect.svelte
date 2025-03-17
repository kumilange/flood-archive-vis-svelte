<script lang="ts">
  import { WebMercatorViewport } from 'viewport-mercator-project';
  import { AREAS, AREA_SELECT_OPTIONS } from '../../lib/constants';
  import { get } from 'svelte/store';
  import {
    viewState,
    updateViewState,
    updateBounds,
    type BoundsType
  } from '../../lib/stores';

  /**
   * Calculate viewport settings to fit bounds
   */
  function fitBoundsToViewport(bounds: BoundsType) {
    const { innerWidth, innerHeight } = window;
    const viewport = new WebMercatorViewport({
      width: innerWidth,
      height: innerHeight,
      ...get(viewState)
    });

    return viewport.fitBounds(bounds, { padding: 20 });
  }

  /**
   * Handle area selection change
   */
  function handleFlyToArea(event: Event) {
    const value = (event.target as HTMLSelectElement).value;

    // Ensure the selected area exists in our config
    if (!AREAS[value]) {
      console.error(`Unknown area: ${value}`);
      return;
    }

    const boundbox = AREAS[value].boundary;
    const newViewState = fitBoundsToViewport(boundbox);

    updateViewState({
      ...newViewState,
      transitionDuration: 'auto'
    });

    updateBounds(boundbox);
  }
</script>

<div class="area-select">
  <select on:change={handleFlyToArea} aria-label="Select geographic area" class="select-dropdown">
    {#each AREA_SELECT_OPTIONS as option}
      {#if option.options}
        <optgroup label={option.label}>
          {#each option.options as subOption}
            <option value={subOption.value}>{subOption.label}</option>
          {/each}
        </optgroup>
      {:else}
        <option value={option.value}>{option.label}</option>
      {/if}
    {/each}
  </select>
</div>

<style>
  .area-select {
    position: relative;
    width: 150px;
  }

  .select-dropdown {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-family: var(--text-font);
    font-size: 14px;
    appearance: none;
    background-color: white;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 16px;
    cursor: pointer;
  }

  .select-dropdown:hover {
    border-color: var(--primary);
  }

  .select-dropdown:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(8, 81, 156, 0.2);
  }
</style> 