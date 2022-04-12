<template>
  <div class='top-wrapper'>
    <MusicList :loading="loading" :pic="pic" :song="song" :title="title" rank/>
  </div>
</template>

<script>
import createComponent from '@/assets/js/createComponent'
import { getTopDetail } from '@/service/topList'
import { TOP_KEY } from '@/assets/js/constant'

export default createComponent('topListDetail', TOP_KEY, getTopDetail)
</script>

<style lang='scss' scoped>
.top-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
