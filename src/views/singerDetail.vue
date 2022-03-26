<template>
  <div class="singer-detail">
    <MusicList :song="song" :title="title" :pic="pic" />
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
      song: []
    }
  },
  async created() {
    const res = await getSingerDetail(this.singer)
    this.song = await processSongs(res.songs)
    console.log(this.song)
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
