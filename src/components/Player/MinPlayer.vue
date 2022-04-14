<template>
  <transition name='mini'>
    <div class='min-player' v-show='!fullScreen' @click='showNormalPlayer'>
      <!--旋转CD-->
      <div class='cd-wrapper'>
        <div class='cd' ref='cdRef'>
          <img :src='currentSong.pic' width='40' height='40' alt='' :class='cdClass' ref='cdImageRef'>
        </div>
      </div>
      <!--左右滑动切换歌曲-->
      <div class='slider-wrapper' ref='sliderWrapperRef'>
        <div class='slide-group'>
          <div class='slide-page' v-for='item in playList' :key='item.id'>
            <h2 class='name'>{{ item.name }}</h2>
            <div class='desc'>{{ item.singer }}</div>
          </div>
        </div>
      </div>
      <!--播放按钮-->
      <div class='control'>
        <ProgressCircle :progress='progress'>
          <i class='icon-mini' :class='miniPlayIcon' @click.stop='togglePlay'/>
        </ProgressCircle>
      </div>
      <!--播放列表按钮-->
      <div class='control' @click.stop='clickShowPlayList'>
        <i class='icon-playlist'></i>
      </div>
      <!--播放列表-->
      <PlayList ref='playlistRef'/>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useCd from '@/components/Player/useCd'
import ProgressCircle from '@/components/Player/ProgressCircle'
import useMinSlider from '@/components/Player/useMinSlider'
import PlayList from '@/components/Player/PlayList'

export default {
  name: 'MinPlayer',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  components: {
    ProgressCircle,
    PlayList
  },
  setup() {
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const playList = computed(() => store.state.playList)
    const miniPlayIcon = computed(() => playing.value ? 'icon-pause-mini' : 'icon-play-mini')
    const { cdClass, cdRef, cdImageRef } = useCd()
    const { sliderWrapperRef } = useMinSlider()
    const playlistRef = ref(null)

    // 切换成全屏
    const showNormalPlayer = () => store.commit('setFullScreen', true)

    // 打开播放列表
    const clickShowPlayList = () => {
      playlistRef.value.show()
    }

    return {
      fullScreen,
      currentSong,
      cdClass,
      cdRef,
      cdImageRef,
      miniPlayIcon,
      playList,
      sliderWrapperRef,
      playlistRef,
      showNormalPlayer,
      clickShowPlayList
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

  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 20px;
    overflow: hidden;
    flex: 1;

    .slide-group {
      overflow: hidden;
      white-space: nowrap;

      .slide-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;

        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }

        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }

  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;

    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }

    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
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
