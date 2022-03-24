<template>
  <div class="singer">
    <IndexList :data="singers"/>
  </div>
</template>

<script>
  import { getSingerList } from '@/service/singer'
  import IndexList from '@/components/InedxList/IndexList'

  export default {
    data() {
      return {
        singers: []
      }
    },
    components: {
      IndexList
    },
    async created() {
      const res = await getSingerList()
      this.singers = res.singers
    }
  }

</script>
<style lang='scss' scoped>
  .singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
