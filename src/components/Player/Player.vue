<template>
  <div class='player'>
    <div class='normal-player' v-show='fullScreen'>
      <div class='background'>
        <img :src='currentSong.pic' alt=''>
      </div>
      <div class='top'>
        <div class='back' @click='back'>
          <i class='icon-back'></i>
        </div>
        <div class='title'>{{ currentSong.name }}</div>
        <div class='sub-title'>{{ currentSong.singer }}</div>
      </div>
      <div class='middle'>
        <div class='middle-l'>
          <div class='cd-wrapper'>
            <div class='cd' ref='cdRef'>
              <img :src='currentSong.pic' alt='' ref='cdImageRef' class='image' :class='cdClass'>
            </div>
          </div>
        </div>
      </div>
      <div class='bottom'>
        <div class='progress-wrapper'>
          <span class='time time-left'>{{ formatTime(currentTime) }}</span>
          <div class='progress-bar-wrapper'>
            <ProgressBar :progress='progress' @changeTouchMove='changeTouchMove' @changeTouchEnd='changeTouchEnd'/>
          </div>
          <span class='time time-right'>{{ formatTime(currentSong.duration) }}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i :class='modeIcon' @click='changeMode'></i>
          </div>
          <div class="icon i-left" :class='disableClass'>
            <i class="icon-prev" @click='previous'></i>
          </div>
          <div class="icon i-center" :class='disableClass'>
            <i :class='playIcon' @click='togglePlay'></i>
          </div>
          <div class="icon i-right" :class='disableClass'>
            <i class="icon-next" @click='next'></i>
          </div>
          <div class="icon i-right">
            <i :class='getFavoriteIcon(currentSong)' @click='toggleFavorite(currentSong)'></i>
          </div>
        </div>
      </div>
    </div>
    <audio ref='audioRef' @pause='pause' @canplay='ready' @error='error' @timeupdate='timeupdate' @ended="end"/>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import useMode from '@/components/Player/useMode'
import useFavorite from '@/components/Player/useFavorite'
import ProgressBar from '@/components/Player/ProgressBar'
import { formatTime } from '@/assets/js/utils'
import { PLAY_MODE } from '@/assets/js/constant'
import useCd from '@/components/Player/useCd'

export default {
  name: 'Player',
  components: {
    ProgressBar
  },
  setup() {
    const store = useStore()
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdClass, cdRef, cdImageRef } = useCd()

    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    let progressChanging = false

    const currentSong = computed(() => store.getters.currentSong)
    const fullScreen = computed(() => store.state.fullScreen)
    // 歌曲播放状态 播放/暂停
    const playing = computed(() => store.state.playing)
    // 播放/暂停 图标切换
    const playIcon = computed(() => !playing.value ? 'icon-play' : 'icon-pause')
    // 当前曲播放的索引下标
    const currentIndex = computed(() => store.state.currentIndex)
    // 播放列表
    const playList = computed(() => store.state.playList)
    // 播放模式
    const playMode = computed(() => store.state.playMode)

    const disableClass = computed(() => songReady.value ? '' : 'disable')

    // 歌曲播放进度
    const progress = computed(() => currentTime.value / currentSong.value.duration)

    // 监听当前播放的歌曲
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      songReady.value = false
      // 如果当前歌曲存在就播放歌曲
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    // 监听歌曲播放状态
    watch(playing, (newPlaying) => {
      const audioEl = audioRef.value
      // 歌曲没有加载完成，就不播放
      if (!songReady.value) {
        return
      }
      // 控制播放器播放/暂停歌曲
      newPlaying ? audioEl.play() : audioEl.pause()
    })

    // 切换播放器模式
    const back = () => {
      store.commit('setFullScreen', false)
    }

    // 点击切换播放/暂停状态
    const togglePlay = () => {
      store.commit('setPlayingState', !playing.value)
    }

    // 下一首
    const next = () => {
      let index = currentIndex.value + 1
      const list = playList.value
      if (!list.length || !songReady.value) {
        return
      }
      if (list.length === 1) {
        return loop()
      }
      // 如果只有一首歌就重复播放当前这首歌
      if (index === list.length) {
        index = 0
      }
      store.commit('setCurrentIndex', index)
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    // 上一首
    const previous = () => {
      let index = currentIndex.value - 1
      const list = playList.value
      if (!list.length || !songReady.value) {
        return
      }
      if (list.length === 1) {
        return loop()
      }
      if (index === -1) {
        index = list.length - 1
      }
      store.commit('setCurrentIndex', index)
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    // 循环播放
    const loop = () => {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }

    // 播放器停止播放回调
    const pause = () => {
      // 同步歌曲状态
      store.commit('setPlayingState', false)
    }

    // 播放器歌曲加载成功回调
    const ready = () => {
      if (songReady.value) {
        return
      }
      songReady.value = true
    }

    // 播放器播放异常回调
    const error = () => {
      songReady.value = true
    }

    // 播放器播放时间回调
    const timeupdate = (e) => {
      // 如果正在滑动中就不同步播放歌曲进度
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }

    // 播放器播放完成回调
    const end = () => {
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }

    // 进度条滑动中的回调
    const changeTouchMove = (progress) => {
      progressChanging = true
      // 同步播放时间的进度
      currentTime.value = currentSong.value.duration * progress
    }

    // 进度条滑动中的回调
    const changeTouchEnd = (progress) => {
      progressChanging = false
      // 同步播放时间的进度 he 播放器歌曲的播放进度
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
    }

    return {
      currentSong,
      fullScreen,
      audioRef,
      playIcon,
      disableClass,
      modeIcon,
      currentTime,
      progress,
      cdClass,
      cdRef,
      cdImageRef,
      pause,
      back,
      togglePlay,
      next,
      previous,
      ready,
      error,
      end,
      timeupdate,
      changeMode,
      getFavoriteIcon,
      toggleFavorite,
      formatTime,
      changeTouchMove,
      changeTouchEnd
    }
  }
}
</script>

<style lang='scss' scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      position: relative;
      margin-bottom: 25px;
      border: 1px solid red;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);

        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
        border: 1px solid red;
      }

      .sub-title {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      border: 1px solid green;

      .middle-l {
        position: absolute;
        width: 100%;
        height: 0;
        padding-top: 80%;
        border: 1px solid;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          box-sizing: border-box;
          border: 1px solid;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 1px solid red;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }

            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      border: 1px solid red;

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        border: 1px solid green;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          border: 1px solid;

          &.time-left {
            text-align: left;
          }

          &.time-right {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
          border: 1px solid red;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
