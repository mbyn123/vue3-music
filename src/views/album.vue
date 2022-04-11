<template>
  <div class='album-wrapper'>
    <MusicList :loading="loading" :pic="pic" :song="song" :title="title"/>
  </div>
</template>

<script>
import createComponent from '@/assets/js/createComponent'
import { getAlbum } from '@/service/recommend'
import { ALBUM_KEY } from '@/assets/js/constant'

export default createComponent('album', ALBUM_KEY, getAlbum)
</script>

<style lang="scss" scoped>
.album-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
