<script lang="ts">
  // No script needed for this simple component
</script>

<div class="legend">
  <strong class="title">Death Toll</strong>
  {#each [
    { label: '0', colorClass: 'color color0' },
    { label: '1 - 10', colorClass: 'color color1' },
    { label: '11 - 50', colorClass: 'color color2' },
    { label: '51 - 100', colorClass: 'color color3' },
    { label: '101 - 1000', colorClass: 'color color4' },
    { label: '1001+', colorClass: 'color color5' }
  ] as item}
    <div class="item">
      <span class={item.colorClass}></span>
      <span class="label">{item.label}</span>
    </div>
  {/each}
</div>

<style lang="scss">
  .legend {
    position: fixed;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    padding: 4px 8px 8px;
    border: 1px solid var(--transparent);
    background-color: var(--transparent);
    border-radius: 4px;
  }

  .title {
    display: block;
    font-weight: 600;
    margin-bottom: 5px;
    color: var(--primary);
  }

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 3px;
  }

  .color {
    width: 15px;
    height: 15px;
    margin-right: 5px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .color0 {
    background-color: rgb(239, 243, 255);
  }

  .color1 {
    background-color: rgb(198, 219, 239);
  }

  .color2 {
    background-color: rgb(158, 202, 225);
  }

  .color3 {
    background-color: rgb(107, 174, 214);
  }

  .color4 {
    background-color: rgb(49, 130, 189);
  }

  .color5 {
    background-color: rgb(8, 81, 156);
  }

  .label {
    font-size: 11px;
  }
</style> 