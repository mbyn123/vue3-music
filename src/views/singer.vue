<template>
  <div class="singer">
    <IndexList :data="singers" @selectSinger="selectSinger"/>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="singerDetail"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/InedxList/IndexList'
import { SINGER_KEY } from '@/assets/js/constant'
import storage from 'good-storage'

export default {
  data() {
    return {
      singers: [],
      singerDetail: {}
    }
  },
  components: {
    IndexList
  },
  async created() {
    const res = await getSingerList()
    this.singers = res.singers
  },
  methods: {
    selectSinger(value) {
      this.singerDetail = value
      this.cacheSinger(value)
      this.$router.push({
        path: `/singer/${value.mid}`
      })
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}

</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
