<script lang="ts">
  import { Map, AttributionControl } from 'svelte-maplibre-gl';
  import { DeckGLOverlay } from 'svelte-maplibre-gl/deckgl';
  import { viewState } from '../lib/stores';
  import { MAP_STYLE } from '../lib/constants';
  import { createMapHandlers, getTooltip } from '../lib/utils';

  // Props
  const props = $props<{layers: any}>();
  // State
  let cursor: string = $state("grab");

  // Map interaction handlers
  const { handleHover, handleDragStart, handleDrag, handleDragEnd } = createMapHandlers(
    (newCursor) => {
      if (newCursor !== cursor) {
        cursor = newCursor;
      }
    },
  );
</script>

<Map
  style={MAP_STYLE}
  center={[$viewState?.longitude || 0, $viewState?.latitude || 0]}
  zoom={$viewState?.zoom || 2}
  attributionControl={false}
  cursor={cursor}
>
  {#if props.layers.length > 0}
    <DeckGLOverlay 
      layers={props.layers}
      getTooltip={getTooltip}
      onHover={handleHover}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    />
  {/if}
  
  <AttributionControl
    customAttribution="Data source: G.R. Brakenridge. Global Active Archive of Large Flood Events. Dartmouth Flood Observatory, University of Colorado, USA."
  />
</Map>
