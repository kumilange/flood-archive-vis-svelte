<script lang="ts">
  export let loading: boolean = false;
  export let error: string | null = null;
</script>

{#if loading}
  <div class="loading" role="status" aria-live="polite">
    <div class="loading-spinner"></div>
    <span>Loading data...</span>
  </div>
{:else if error}
  <div class="error" role="alert" aria-live="assertive">
    <span class="error-icon">⚠️</span>
    <span>{error}</span>
  </div>
{/if}

<style>
  .loading,
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

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error {
    color: red;
  }

  .error-icon {
    font-size: 24px;
  }
</style> 