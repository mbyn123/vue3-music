<template>
  <Header/>
  <Tab/>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-slot="{ Component }" :style='viewStyle' name='user'>
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </transition>
  </router-view>
  <!--播放器-->
  <Player/>
</template>

<script>
import Header from '@/components/Header/Header'
import Tab from '@/components/Tab/Tab'
import Player from '@/components/Player/Player'
import { mapState } from 'vuex'

export default {
  components: {
    Header,
    Tab,
    Player
  },
  computed: {
    ...mapState(['playList']),
    viewStyle() {
      return {
        bottom: this.playList.length ? '60px' : '0'
      }
    }
  }
}
</script>

<style lang='scss'>
</style>
