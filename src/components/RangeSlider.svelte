<script lang="ts">
  import { formatLabel } from '../lib/utils';
  
  // Constants
  const MS_PER_DAY = 8.64e7;
  const ANIMATION_SPEED = MS_PER_DAY * 10;

  export type RangeValues = [start: number, end: number];
  type RangeSliderProps = {
    min: number;
    max: number;
    values: RangeValues;
    onChange: (range: RangeValues) => void;
  }

  const { min, max, values, onChange } = $props<RangeSliderProps>();
  let animationId: number | undefined = undefined;
  let isPlaying = $state(false);  
  const isButtonEnabled = $derived(min < max && (values[0] > min || values[1] < max));

  /**
	 * Handle min range input change
	 */
  function handleMinChange(e: Event) {
    const newMin = Number((e.target as HTMLInputElement).value);
    if (newMin >= min && newMin < values[1]) {
      onChange([newMin, values[1]]);
    }
  }

  /**
	 * Handle max range input change
	 */
  function handleMaxChange(e: Event) {
    const newMax = Number((e.target as HTMLInputElement).value);
    if (newMax > min && newMax <= max) {
      onChange([values[0], newMax]);
    }
  }

  /**
   * Toggle animation play/pause
   */
  function toggleAnimation() {
    isPlaying = !isPlaying;
  }
  
  /**
   * Handle animation frame updates
   */
  function updateAnimation() {
    const span = values[1] - values[0];
    let nextValueMin = values[0] + ANIMATION_SPEED;

    if (nextValueMin + span >= max) {
      nextValueMin = min;
    }
    
    onChange([nextValueMin, nextValueMin + span]);

    // Schedule the next animation frame
		if (isPlaying) {
			animationId = requestAnimationFrame(updateAnimation);
		}
  }

  // Animation effect triggered when isPlaying changes
  $effect(() => {
    if (isPlaying) {
      animationId = requestAnimationFrame(updateAnimation);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = undefined;
      }
    };
  }); 
</script>

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
          min={min} 
          max={max} 
          value={values[0]} 
          oninput={handleMinChange}
          class="range range-min"
        />
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={values[1]} 
          oninput={handleMaxChange}
          class="range range-max"
        />
        <div class="track"></div>
        <div 
          class="range-selected"
          style="left: {((values[0] - min) / (max - min)) * 100}%; 
              width: {((values[1] - values[0]) / (max - min)) * 100}%;"
        ></div>
      </div>
      <div class="labels">
        <span class="label-min">{formatLabel(values[0])}</span>
        <span class="label-max">{formatLabel(values[1])}</span>
      </div>
    </div>
  </div>
</div>

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