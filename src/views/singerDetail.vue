<template>
  <div class="singer-detail">
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'

export default {
  name: 'singerDetail',
  props: {
    singer: Object
  },
  async created() {
    const res = await getSingerDetail(this.singer)
    console.log(res)
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
