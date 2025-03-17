<script lang="ts">
  import { WebMercatorViewport } from 'viewport-mercator-project';
  import { AREAS, AREA_SELECT_OPTIONS } from '../../lib/constants';
  import { get } from 'svelte/store';
  import {
    viewState,
    updateViewState,
    updateBounds,
    type BoundsType,
    type ViewStateType
  } from '../../lib/stores';

  // Keep track of the currently selected area
  let selectedArea = 'all';
  let isHandlingChange = false;

  /**
   * Calculate viewport settings to fit bounds
   */
  function fitBoundsToViewport(bounds: BoundsType): Partial<ViewStateType> {
    try {
      const { innerWidth, innerHeight } = window;
      const currentViewState = get(viewState);
      
      const viewport = new WebMercatorViewport({
        width: innerWidth,
        height: innerHeight,
        ...currentViewState
      });

      // Use type assertion to ensure TypeScript understands this will return the expected properties
      const result = viewport.fitBounds(bounds, { padding: 20 }) as {
        longitude: number;
        latitude: number;
        zoom: number;
      };
      
      return {
        longitude: result.longitude,
        latitude: result.latitude,
        zoom: result.zoom
      };
    } catch (error) {
      console.error('Error calculating viewport:', error);
      return {}; // Return empty object as fallback
    }
  }

  /**
   * Handle area selection change - triggered by the reactive statement
   */
  function handleFlyToArea() {
    if (isHandlingChange) return; // Prevent recursive calls
    isHandlingChange = true;
    
    try {
      console.log('Area selected:', selectedArea);
      
      // Ensure the selected area exists in our config
      if (!AREAS[selectedArea]) {
        console.error(`Unknown area: ${selectedArea}`);
        return;
      }

      const boundbox = AREAS[selectedArea].boundary;
      const newViewState = fitBoundsToViewport(boundbox);

      // Update the viewState store 
      updateViewState({
        ...newViewState,
        transitionDuration: 1000 
      });

      // Update the bounds store
      updateBounds(boundbox);
    } catch (error) {
      console.error('Error updating view state:', error);
    } finally {
      isHandlingChange = false;
    }
  }

  // Listen for changes to selectedArea and trigger the handler
  $: {
    if (selectedArea && !isHandlingChange) {
      handleFlyToArea();
    }
  }
</script>

<div class="area-select">
  <select 
    bind:value={selectedArea}
    aria-label="Select geographic area" 
    class="select-dropdown"
  >
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