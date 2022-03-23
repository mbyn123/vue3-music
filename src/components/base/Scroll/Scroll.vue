<template>
  <div ref="rootRef">
    <slot/>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import useScoll from './useScoll'

  export default {
    name: 'Scoll',
    props: {
      click: {
        type: Boolean,
        default: true
      }
    },
    steup(props) {
      const rootRef = ref(null)
      useScoll(rootRef, props)
      return { rootRef }
    }
  }
</script>

<style lang='scss' scoped>

</style>
