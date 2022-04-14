<template>
  <teleport to='body' @click='hide'>
    <transition name='slide-down'>
      <div class='message' v-show='visible'>
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'Message',
  data() {
    return {
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, 1500)
    },
    hide() {
      clearTimeout(this.timer)
      this.visible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.message {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 400;
  background: $color-dialog-background;

  &.slide-down-enter-active, &.slide-down-leave-active {
    transition: all 0.3s
  }

  &.slide-down-enter-from, &.slide-down-leave-to {
    transform: translate3d(0, -100%, 0)
  }
}
</style>
