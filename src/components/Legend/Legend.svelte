<script lang="ts">
  // No script needed for this simple component
</script>

<div class="legend">
  <span class="title">Death Toll</span>
  <div class="item">
    <span class="color color0"></span>
    <span class="label">0</span>
  </div>
  <div class="item">
    <span class="color color1"></span>
    <span class="label">1 - 10</span>
  </div>
  <div class="item">
    <span class="color color2"></span>
    <span class="label">11 - 50</span>
  </div>
  <div class="item">
    <span class="color color3"></span>
    <span class="label">51 - 100</span>
  </div>
  <div class="item">
    <span class="color color4"></span>
    <span class="label">101 - 1000</span>
  </div>
  <div class="item">
    <span class="color color5"></span>
    <span class="label">1001+</span>
  </div>
</div>

<style lang="scss">
  .legend {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: var(--transparent);
    padding: 10px;
    border-radius: 4px;
    z-index: 1;
    font-size: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
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