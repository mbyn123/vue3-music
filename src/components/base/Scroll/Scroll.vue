<template>
  <div ref="rootRef">
    <slot/>
  </div>
</template>

<script>
  import useScroll from './useScroll'
  import { ref } from 'vue'

  export default {
    name: 'scroll',
    props: {
      click: {
        type: Boolean,
        default: true
      },
      probeType: {
        type: Number,
        default: 0
      }
    },
    emits: ['scroll'],
    setup(props, { emit }) {
      const rootRef = ref(null)
      const scroll = useScroll(rootRef, props, emit)

      return {
        rootRef,
        // 将scroll实例暴露出去
        scroll
      }
    }
  }
</script>
