<script lang="ts">
  import { Map, AttributionControl } from 'svelte-maplibre-gl';
  import { DeckGLOverlay } from 'svelte-maplibre-gl/deckgl';
  import { getTooltip } from '../lib/utils';
  
  export let style: string;
  export let viewState: any;
  export let cursor: string;
  export let layers: any[];
  export let handleHover: (info: any) => void;
  export let handleDragStart: (info: any) => void;
  export let handleDrag: (info: any) => void;
  export let handleDragEnd: (info: any) => void;
  export let customAttribution: string = '';
</script>

<Map
  {style}
  center={[viewState?.longitude || 0, viewState?.latitude || 0]}
  zoom={viewState?.zoom || 2}
  attributionControl={false}
  {cursor}
>
  {#if layers.length > 0}
    <DeckGLOverlay 
      {layers}
      getTooltip={getTooltip}
      onHover={handleHover}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    />
  {/if}
  
  <AttributionControl
    {customAttribution}
  />
</Map>
