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
      <div class='bottom'>
        <div class="operators">
          <div class="icon i-left">
            <i class='icon-sequence'></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev"></i>
          </div>
          <div class="icon i-center">
            <i :class='playIcon' @click='togglePlay'></i>
          </div>
          <div class="icon i-right">
            <i class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class='icon-favorite'></i>
          </div>
        </div>
      </div>
    </div>
    <audio ref='audioRef'></audio>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default {
  name: 'Player',
  setup() {
    const audioRef = ref(null)
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong)
    const fullScreen = computed(() => store.state.fullScreen)
    // 歌曲播放状态 播放/暂停
    const playing = computed(() => store.state.playing)

    const playIcon = computed(() => !playing.value ? 'icon-play' : 'icon-pause')

    // 播放歌曲
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      // 如果当前歌曲存在就播放歌曲
      const audioEl = audioRef.value
      audioEl.src = newSong.url
      audioEl.play()
    })

    // 播放/暂停
    watch(playing, (newPlaying) => {
      const audioEl = audioRef.value
      if (newPlaying) {
        audioEl.play()
      } else {
        audioEl.pause()
      }
    })

    const back = () => {
      store.commit('setFullScreen', false)
    }

    const togglePlay = () => {
      console.log('1111')
      store.commit('setPlayingState', !playing.value)
    }

    return {
      currentSong,
      fullScreen,
      audioRef,
      playIcon,
      back,
      togglePlay
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

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      border: 1px solid red;

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

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
