<template>
  <teleport to='body'>
    <transition name='list-fade'>
      <div class='play-list' v-show='visible && playlist.length' @click='hide'>
        <div class='list-wrapper' @click.stop>
          <div class='list-header'>
            <h1 class='title'>
              <i class='icon' :class='modeIcon' @click='changeMode'></i>
              <span class='text'>{{ modeText }}</span>
              <span class='clear' @click='clearSong'><i class='icon-clear'/></span>
            </h1>
          </div>
          <Scroll ref='scrollRef' class='list-content'>
            <transition-group name='list' ref='listRef' tag='ul'>
              <li class='item' v-for='item in sequenceList' :key='item.id' @click='selectSong(item)'>
                <i class='current' :class='getCurrentIcon(item)'></i>
                <span class='text'>{{ item.name }}</span>
                <span class='favorite' @click.stop='toggleFavorite(item)'><i :class='getFavoriteIcon(item)'/> </span>
                <span class='delete' :class='{"disable":removing}' @click.stop='removeSong(item)'> <i
                  class='icon-delete'/> </span>
              </li>
            </transition-group>
          </Scroll>
          <div class='list-add'>
            <div class='add' @click='openAddSong'>
              <i class='icon-add'>
                <span class='text'>添加歌曲到队列</span>
              </i>
            </div>
          </div>
          <div class='list-footer' @click='hide'>
            <span>关闭</span>
          </div>
        </div>
        <Confirm ref='confirmRef' text='是否清空播放列表?' confirm-text='清空' @confirm='confirm'/>
        <AddSong ref='addSongRef'/>
      </div>
    </transition>
  </teleport>

</template>

<script>
import useMode from '@/components/Player/useMode'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useFavorite from '@/components/Player/useFavorite'
import Scroll from '@/components/base/Scroll/Scroll'
import Confirm from '@/components/base/Confirm/Confirm'
import AddSong from '@/components/AddSong/AddSong'

export default {
  name: 'PlayList',
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  setup() {
    const store = useStore()
    const visible = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const removing = ref(false)
    const confirmRef = ref(false)
    const addSongRef = ref(null)

    const playlist = computed(() => store.state.playList)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    watch(currentSong, async () => {
      if (!visible.value) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

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
      scrollToCurrent()
    }

    const hide = () => {
      visible.value = false
    }

    // 播放歌曲
    const selectSong = (song) => {
      const index = store.state.playList.findIndex(item => item.id === song.id)
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }

    // 滚动到当前播放歌曲的位置
    const scrollToCurrent = () => {
      const index = sequenceList.value.findIndex(item => item.id === currentSong.value.id)
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    // 删除歌曲
    const removeSong = (song) => {
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('deleteSong', song)
      setTimeout(() => {
        removing.value = false
      }, 300)
    }

    // 清空列表
    const clearSong = () => {
      confirmRef.value.show()
    }

    const confirm = () => {
      hide()
      store.dispatch('clearPlayList')
    }

    const openAddSong = () => {
      addSongRef.value.show()
    }

    return {
      visible,
      playlist,
      sequenceList,
      modeIcon,
      modeText,
      currentSong,
      scrollRef,
      listRef,
      removing,
      confirmRef,
      addSongRef,
      confirm,
      clearSong,
      selectSong,
      getFavoriteIcon,
      toggleFavorite,
      changeMode,
      show,
      hide,
      getCurrentIcon,
      removeSong,
      openAddSong
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
