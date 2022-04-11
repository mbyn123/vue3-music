<template>
  <div class='player' v-show='playList.length'>
    <transition name='normal' @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
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
        <div class='middle' @touchstart.prevent='onTouchStart' @touchmove.prevent='onTouchMove' @touchend='onTouchEnd'>
          <!--旋转CD-->
          <div class='middle-l' :style='middleLeftStyle'>
            <div class='cd-wrapper' ref="cdWrapperRef">
              <div class='cd' ref='cdRef'>
                <img :src='currentSong.pic' alt='' ref='cdImageRef' class='image' :class='cdClass'>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!--歌词列表-->
          <Scroll class='middle-r' ref='lyricScrollRef' :style='middleRightStyle'>
            <div class='lyric-wrapper'>
              <div v-if='currentLyric' ref='lyricListRef'>
                <p class='text' :class="{'current': currentLineNum === index}"
                   v-for='(item,index) in currentLyric.lines'
                   :key='item.num'>{{ item.txt }}</p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class='bottom'>
          <!--指示点-->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <!--进度条-->
          <div class='progress-wrapper'>
            <span class='time time-left'>{{ formatTime(currentTime) }}</span>
            <div class='progress-bar-wrapper'>
              <ProgressBar :progress='progress' @changeTouchMove='changeTouchMove' @changeTouchEnd='changeTouchEnd'
                           ref='barRef'/>
            </div>
            <span class='time time-right'>{{ formatTime(currentSong.duration) }}</span>
          </div>
          <!--播放按钮-->
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
    </transition>
    <audio ref='audioRef' @pause='pause' @canplay='ready' @error='error' @timeupdate='timeupdate' @ended="end"/>
    <MinPlayer :progress='progress' :togglePlay='togglePlay'/>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from '@/components/Player/useMode'
import useFavorite from '@/components/Player/useFavorite'
import useCd from '@/components/Player/useCd'
import useLyric from '@/components/Player/useLyric'
import useInteractive from '@/components/Player/useInteractive'
import useAnimation from '@/components/Player/useAnimation'
import { formatTime } from '@/assets/js/utils'
import { PLAY_MODE } from '@/assets/js/constant'
import ProgressBar from '@/components/Player/ProgressBar'
import Scroll from '@/components/base/Scroll/Scroll'
import MinPlayer from '@/components/Player/MinPlayer'

export default {
  name: 'Player',
  components: {
    Scroll,
    ProgressBar,
    MinPlayer
  },
  setup() {
    const audioRef = ref(null)
    const songReady = ref(false)
    const currentTime = ref(0)
    const barRef = ref(null)
    let progressChanging = false

    const store = useStore()
    const { modeIcon, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { cdClass, cdRef, cdImageRef } = useCd()
    const {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      playingLyric,
      pureMusicLyric,
      playLyric,
      stopLyric
    } = useLyric({
      songReady,
      currentTime
    })

    const {
      currentShow,
      middleLeftStyle,
      middleRightStyle,
      onTouchStart,
      onTouchMove,
      onTouchEnd
    } = useInteractive()

    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()

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
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })

    // 监听播放器为全屏状态时,同步进度条进度
    watch(fullScreen, async (newValue) => {
      if (newValue) {
        await nextTick()
        barRef.value.setProgress(progress.value)
      }
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
      const list = playList.value
      if (!list.length || !songReady.value) {
        return
      }
      if (list.length === 1) {
        return loop()
      }
      let index = currentIndex.value + 1
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
      const list = playList.value
      if (!list.length || !songReady.value) {
        return
      }
      if (list.length === 1) {
        return loop()
      }
      let index = currentIndex.value - 1
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
      playLyric()
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
      // 同步歌词进度
      playLyric()
      stopLyric()
    }

    // 进度条滑动完成的回调
    const changeTouchEnd = (progress) => {
      progressChanging = false
      // 同步播放时间的进度 he 播放器歌曲的播放进度
      audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      playLyric()
    }

    return {
      currentSong,
      fullScreen,
      audioRef,
      playIcon,
      playList,
      disableClass,
      modeIcon,
      currentTime,
      progress,
      cdClass,
      cdRef,
      cdImageRef,
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      playingLyric,
      pureMusicLyric,
      currentShow,
      middleLeftStyle,
      middleRightStyle,
      barRef,
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
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
      changeTouchEnd,
      onTouchStart,
      onTouchMove,
      onTouchEnd
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

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          box-sizing: border-box;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

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

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;

          &.time-left {
            text-align: left;
          }

          &.time-right {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
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

    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;

      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }

    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
