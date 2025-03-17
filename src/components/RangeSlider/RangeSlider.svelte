<script lang="ts">
  import { onDestroy } from 'svelte';

  // Constants
  const MS_PER_DAY = 8.64e7;
  const ANIMATION_SPEED = MS_PER_DAY * 10;

  // Props
  export let min: number;
  export let max: number;
  export let value: [number, number];
  export let formatLabel: (value: number) => string;
  export let onChange: (value: [number, number]) => void;

  // Local state
  let isPlaying = false;
  let animationId: number | undefined = undefined;
  let minValue = value[0];
  let maxValue = value[1];

  // Derived values
  $: formattedMinDate = formatLabel(minValue);
  $: formattedMaxDate = formatLabel(maxValue);
  $: isButtonEnabled = minValue > min || maxValue < max;
  
  // Sync with parent values
  $: {
    if (value[0] !== minValue || value[1] !== maxValue) {
      minValue = value[0];
      maxValue = value[1];
    }
  }

  // Handle min range input change
  function handleMinChange(e: Event) {
    const newMin = Number((e.target as HTMLInputElement).value);
    if (newMin < maxValue) {
      minValue = newMin;
      onChange([minValue, maxValue]);
    }
  }

  // Handle max range input change
  function handleMaxChange(e: Event) {
    const newMax = Number((e.target as HTMLInputElement).value);
    if (newMax > minValue) {
      maxValue = newMax;
      onChange([minValue, maxValue]);
    }
  }

  /**
   * Handle animation frame updates
   */
  function updateAnimation() {
    const span = maxValue - minValue;
    let nextValueMin = minValue + ANIMATION_SPEED;

    if (nextValueMin + span >= max) {
      nextValueMin = min;
    }

    minValue = nextValueMin;
    maxValue = nextValueMin + span;
    onChange([minValue, maxValue]);
  }

  /**
   * Toggle animation play/pause
   */
  function toggleAnimation() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
      animationFrame();
    }
  }
  
  /**
   * Request animation frame loop
   */
  function animationFrame() {
    if (!isPlaying) return;
    
    updateAnimation();
    animationId = requestAnimationFrame(animationFrame);
  }

  // Cleanup on component destroy
  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
</script>

<div class="range-slider">
  <button
    class="play-button"
    disabled={!isButtonEnabled}
    on:click={toggleAnimation}
    title={isPlaying ? 'Stop' : 'Animate'}
    aria-label={isPlaying ? 'Stop animation' : 'Start animation'}
  >
    {#if isPlaying}
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      >
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    {:else}
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
      >
        <polygon points="5,3 19,12 5,21"></polygon>
      </svg>
    {/if}
  </button>

  <div class="slider-wrapper">
    <div class="range-container">
      <input 
        type="range" 
        {min} 
        {max} 
        value={minValue} 
        on:input={handleMinChange}
        class="range range-min"
      />
      <input 
        type="range" 
        {min} 
        {max} 
        value={maxValue} 
        on:input={handleMaxChange}
        class="range range-max"
      />
      <div class="track"></div>
      <div 
        class="range-selected"
        style="left: {((minValue - min) / (max - min)) * 100}%; 
             width: {((maxValue - minValue) / (max - min)) * 100}%;"
      ></div>
    </div>
    <div class="labels">
      <span class="label-min">{formattedMinDate}</span>
      <span class="label-max">{formattedMaxDate}</span>
    </div>
  </div>
</div>

<style lang="scss">
  .range-slider {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .play-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 1px solid var(--primary);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: rgba(8, 81, 156, 0.1);
    }
  }

  .slider-wrapper {
    flex: 1;
    margin-left: 16px;
  }

  .range-container {
    position: relative;
    height: 40px;
    display: flex;
    align-items: center;
  }

  .range {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: none;
    pointer-events: none;
    z-index: 3;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      pointer-events: all;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
      border: 2px solid var(--primary);
      cursor: pointer;
    }

    &::-moz-range-thumb {
      pointer-events: all;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
      border: 2px solid var(--primary);
      cursor: pointer;
    }
  }

  .track {
    position: absolute;
    width: 100%;
    height: 4px;
    background-color: #e0e0e0;
    z-index: 1;
  }

  .range-selected {
    position: absolute;
    height: 4px;
    background-color: var(--primary);
    z-index: 2;
  }

  .labels {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-weight: 600;
    color: var(--primary);
    font-size: 14px;
  }
</style> 