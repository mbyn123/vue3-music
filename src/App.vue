<template>
  <Header/>
  <Tab/>
  <router-view/>
  <Player/>
</template>

<script>
import Header from '@/components/Header/Header'
import Tab from '@/components/Tab/Tab'
import Player from '@/components/Player/Player'

export default {
  components: {
    Header,
    Tab,
    Player
  }
}
</script>

<style lang='scss'>
</style>
