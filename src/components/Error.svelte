<script lang="ts">
  export let error: Error | null = null;
</script>

{#if error}
  <div class="error" role="alert" aria-live="assertive">
    <span class="error-icon">⚠️</span>
    <span>{error}</span>
  </div>
{/if}

<style>
  .error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .error {
    color: red;
  }

  .error-icon {
    font-size: 24px;
  }
</style> 