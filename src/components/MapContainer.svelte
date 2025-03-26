<script lang="ts">
  import { Map, AttributionControl } from 'svelte-maplibre-gl';
  import { DeckGLOverlay } from 'svelte-maplibre-gl/deckgl';
  import type { GeoJsonLayer } from '@deck.gl/layers';
  import type { MapLibreEvent } from 'maplibre-gl';

  import { setMap } from '../lib/stores';
  import { INITIAL_VIEW_STATE, MAP_STYLE } from '../lib/constants';
  import { createMapHandlers, getTooltip } from '../lib/utils';

  const { layers } = $props<{layers: (GeoJsonLayer | null)[]}>();
  let cursor = $state("grab");

  // Map interaction handlers
  const { handleHover, handleDragStart, handleDrag, handleDragEnd } = createMapHandlers(
    (newCursor) => {
      if (newCursor !== cursor) {
        cursor = newCursor;
      }
    },
  );

  /**
   * Handle map loaded event
   */
  function handleMapLoaded(e: MapLibreEvent) {
    const mapInstance = e.target;
    setMap(mapInstance);
  }
</script>

<Map
  style={MAP_STYLE}
  center={[INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude]}
  zoom={INITIAL_VIEW_STATE.zoom}
  attributionControl={false}
  cursor={cursor}
  onload={handleMapLoaded}
>
  {#if layers.length > 0}
    <DeckGLOverlay 
      layers={layers}
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
