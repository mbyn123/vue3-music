<template>
  <div class="singer-detail">
    <MusicList :loading="loading" :pic="pic" :song="song" :title="title" />
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/MusicList/MusicList'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

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
    if (!this.computedSinger) {
      // 获取上一级路由路径，返回
      const path = this.$route.matched[0].path
      this.$router.push({ path })
      return
    }
    const res = await getSingerDetail(this.computedSinger)
    await processSongs(res.songs)
    this.loading = false
  },
  components: {
    MusicList
  },
  computed: {
    // 页面刷新从缓存中获取数据
    computedSinger() {
      let rel = null
      const singer = this.singer
      if (JSON.stringify(singer) !== '{}') {
        rel = singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        console.log(cachedSinger, 'cachedSinger')
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          rel = cachedSinger
        }
      }
      return rel
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
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
