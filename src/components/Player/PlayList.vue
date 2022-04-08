<template>
  <teleport to='body'>
    <transition name='list-fade'>
      <div class='play-list' v-show='visible && playlist.length' @click='hide'>
        <div class='list-wrapper' @click.stop>
          <div class='list-header'>
            <h1 class='title'>
              <i class='icon' :class='modeIcon' @click='changeMode'></i>
              <span class='text'>{{ modeText }}</span>
              <span class='clear'>
           <i class='icon-clear'></i>
         </span>
            </h1>
          </div>
          <Scroll ref='scrollRef' class='list-content'>
            <ul>
              <li class='item' v-for='item in sequenceList' :key='item.id'>
                <i class='current' :class='getCurrentIcon(item)'></i>
                <span class='text'>{{ item.name }}</span>
                <span class='favorite' @click='toggleFavorite(item)'>
                <i :class='getFavoriteIcon(item)'/>
              </span>
                <span class='delete'>
                <i class='icon-delete'/>
              </span>
              </li>
            </ul>
          </Scroll>
          <div class='list-add'>
            <div class='add'>
              <i class='icon-add'>
                <span class='text'>添加歌曲到队列</span>
              </i>
            </div>
          </div>
          <div class='list-footer' @click='hide'>
            <span>关闭</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>

</template>

<script>
import useMode from '@/components/Player/useMode'
import { computed, nextTick, ref } from 'vue'
import { useStore } from 'vuex'
import useFavorite from '@/components/Player/useFavorite'
import Scroll from '@/components/base/Scroll/Scroll'

export default {
  name: 'PlayList',
  components: {
    Scroll
  },
  setup() {
    const store = useStore()
    const visible = ref(false)
    const scrollRef = ref(null)
    const playlist = computed(() => store.state.playList)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)
    // 播放模式
    const { modeIcon, modeText, changeMode } = useMode()
    // 收藏状态
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    const getCurrentIcon = (song) => {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }

    const show = async () => {
      visible.value = true
      await nextTick()
      // 刷新scroll组件
      scrollRef.value.scroll.refresh()
    }

    const hide = () => {
      visible.value = false
    }

    return {
      visible,
      playlist,
      sequenceList,
      modeIcon,
      modeText,
      currentSong,
      scrollRef,
      getFavoriteIcon,
      toggleFavorite,
      changeMode,
      show,
      hide,
      getCurrentIcon
    }
  }
}
</script>

<style lang='scss' scoped>
.play-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          @include extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }

    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
