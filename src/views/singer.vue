<template>
  <div class="singer">
    <IndexList :data="singers" @selectSinger="selectSinger" />
    <router-view :singer="singerDetail" />
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/InedxList/IndexList'

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
      this.$router.push({
        path: `/singer/${value.mid}`
      })
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
