<script lang="ts">
  import { onDestroy } from 'svelte';
  
  // Constants
  const MS_PER_DAY = 8.64e7;

  // Props
  const props = $props<{
    min: number;
    max: number;
    value: [number, number];
    formatLabel: (timestamp: number) => string;
    onChange: (range: [number, number]) => void;
    animationSpeed?: number;
  }>();

  // Default value for optional props
  const animationSpeed = props.animationSpeed ?? MS_PER_DAY * 10;

    // Local state using Runes
  let isPlaying = $state(false);
  let animationId = $state<number | undefined>(undefined);
  let minValue = $state(props.value[0]);
  let maxValue = $state(props.value[1]);
  
  // Derived values
  const formattedMinDate = $derived(props.formatLabel(minValue));
  const formattedMaxDate = $derived(props.formatLabel(maxValue));
  const isButtonEnabled = $derived(props.min < props.max && (minValue > props.min || maxValue < props.max));
  
  $effect(() => {
    if (!isPlaying && (props.value[0] !== minValue || props.value[1] !== maxValue)) {
      minValue = props.value[0];
      maxValue = props.value[1];
    }
  });

  // Handle min range input change
  function handleMinChange(e: Event) {
    const newMin = Number((e.target as HTMLInputElement).value);
    if (newMin >= props.min && newMin < maxValue) {
      minValue = newMin;
      props.onChange([minValue, maxValue]);
    }
  }

  // Handle max range input change
  function handleMaxChange(e: Event) {
    const newMax = Number((e.target as HTMLInputElement).value);
    if (newMax > minValue && newMax <= props.max) {
      maxValue = newMax;
      props.onChange([minValue, newMax]);
    }
  }

  /**
   * Handle animation frame updates
   */
  function updateAnimation() {
    const span = maxValue - minValue;
    let nextValueMin = minValue + animationSpeed;

    if (nextValueMin + span >= props.max) {
      nextValueMin = props.min;
    }

    // Update values
    minValue = nextValueMin;
    maxValue = nextValueMin + span;
    
    // Notify parent
    props.onChange([minValue, maxValue]);
  }

  /**
   * Toggle animation play/pause
   */
  function toggleAnimation() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
      // Cancel any existing animation
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      // Start a new animation
      animationFrame();
    } else if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = undefined;
    }
  }
  
  /**
   * Request animation frame loop
   */
  function animationFrame() {    
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

{#if props.min !== props.max}
  <div class="slider">
    <div class="range-slider">
      <button
        class="play-button"
        disabled={!isButtonEnabled}
        onclick={toggleAnimation}
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
            min={props.min} 
            max={props.max} 
            value={minValue} 
            oninput={handleMinChange}
            class="range range-min"
          />
          <input 
            type="range" 
            min={props.min} 
            max={props.max} 
            value={maxValue} 
            oninput={handleMaxChange}
            class="range range-max"
          />
          <div class="track"></div>
          <div 
            class="range-selected"
            style="left: {((minValue - props.min) / (props.max - props.min)) * 100}%; 
                width: {((maxValue - minValue) / (props.max - props.min)) * 100}%;"
          ></div>
        </div>
        <div class="labels">
          <span class="label-min">{formattedMinDate}</span>
          <span class="label-max">{formattedMaxDate}</span>
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .slider {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 1000px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
  
  .range-slider {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 12px;
    font-family: var(--text-font);
    font-weight: 300;
    color: var(--primary);
  }

  .play-button {
    width: 30px;
    height: 30px;
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
    margin-top: -6px;
    height: 20px; 
  }

  .range-container {
    position: relative;
    height: 16px;
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
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: white;
      border: 2px solid var(--primary);
      cursor: pointer;
    }

    &::-moz-range-thumb {
      pointer-events: all;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: white;
      border: 2px solid var(--primary);
      cursor: pointer;
    }
  }

  .track {
    position: absolute;
    width: 99%;
    height: 2px;
    top: 9px;
    background-color: #e0e0e0;
    z-index: 1;
    margin-left: 2px;
  }

  .range-selected {
    position: absolute;
    height: 2px;
    top: 9px;
    background-color: var(--primary);
    z-index: 2;
    margin-left: 2px;
  }

  .labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0;
    font-weight: 300;
    color: var(--primary);
    font-size: 12px;
  }
</style> 