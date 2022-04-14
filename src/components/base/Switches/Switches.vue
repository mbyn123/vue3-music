<template>
  <ul class='switches'>
    <li class='switch-item' :class='{"active": modelValue === index}' v-for='(item,index) in items' :key='item'
        @click='switchItem(index)'>
      {{ item }}
    </li>
    <div class='active-bar' :style='activeStyle'/>
  </ul>
</template>

<script>
export default {
  name: 'Switches.vue',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    modelValue: Number
  },
  data() {
    return {}
  },
  computed: {
    activeStyle() {
      const x = 120 * this.modelValue
      return { transform: `translate3d(${x}px,0,0)` }
    }
  },
  methods: {
    switchItem(index) {
      this.$emit('update:modelValue', index)
    }
  }
}
</script>

<style lang='scss' scoped>
.switches {
  display: flex;
  align-items: center;
  position: relative;
  width: 240px;
  margin: 0 auto;
  border-radius: 5px;
  border: 1px solid $color-highlight-background;

  .switch-item {
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;
    z-index: 10;

    &.active {
      color: $color-text;
    }
  }

  .active-bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    background: $color-highlight-background;
    transition: transform 0.3s;
  }
}
</style>
