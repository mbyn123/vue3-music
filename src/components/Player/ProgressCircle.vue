<template>
  <div class='progress-circle'>
    <svg width='32' height='32' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
      <circle r='50' cx='50' cy='50' fill='transparent' class='progress-background'/>
      <circle r='50' cx='50' cy='50' fill='transparent' class='progress-bar' :stroke-dasharray='dasharray'
              :stroke-dashoffset='dashoffset'/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ProgressCircle',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dasharray: Math.PI * 100
    }
  },
  computed: {
    dashoffset() {
      return (1 - this.progress) * this.dasharray
    }
  }
}
</script>

<style lang='scss' scoped>
.progress-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress-background {
      transform: scale(0.9);
      stroke: $color-theme-d;
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>
