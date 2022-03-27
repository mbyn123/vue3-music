<template>
  <div class="singer-detail">
    <MusicList :pic="pic" :song="song" :title="title" :loading="loading"/>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/MusicList/MusicList'
import { toRaw } from 'vue'

export default {
  name: 'singerDetail',
  props: {
    singer: Object
  },
  data() {
    return {
      song: [],
      loading: true
    }
  },
  async created() {
    const res = await getSingerDetail(this.singer)
    this.song = await processSongs(res.songs)
    this.loading = false
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.singer && toRaw(this.singer.name)
    },
    pic() {
      return this.singer && toRaw(this.singer.pic)
    }
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
