<template>
  <div class="singer-detail">
    <MusicList :loading="loading" :pic="pic" :song="song" :title="title"/>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { SINGER_KEY } from '@/assets/js/constant'
import createComponent from '@/assets/js/createComponent'

export default createComponent('singerDetail', SINGER_KEY, getSingerDetail)
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
