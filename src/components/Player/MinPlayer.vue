<template>
  <transition name='mini'>
    <div class='min-player' v-show='!fullScreen' @click='showNormalPlayer'>
      <div class='cd-wrapper'>
        <div class='cd' ref='cdRef'>
          <img :src='currentSong.pic' width='40' height='40' alt='' :class='cdClass' ref='cdImageRef'>
        </div>
      </div>
      <div>
        <h2 class='name'>{{ currentSong.name }}</h2>
        <div class='desc'>{{ currentSong.singer }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
import useCd from '@/components/Player/useCd'

export default {
  name: 'MinPlayer',
  setup() {
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const { cdClass, cdRef, cdImageRef } = useCd()
    const showNormalPlayer = () => store.commit('setFullScreen', true)
    return {
      fullScreen,
      currentSong,
      cdClass,
      cdRef,
      cdImageRef,
      showNormalPlayer
    }
  }
}
</script>

<style lang='scss' scoped>
.min-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;

  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;

    .cd {
      height: 100%;
      width: 100%;

      img {
        border-radius: 50%;

        &.playing {
          animation: rotate 20s linear infinite;
        }
      }
    }
  }

  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }

  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
