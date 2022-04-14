<template>
  <teleport to='body'>
    <transition name='slide' v-show='visible'>
      <div class='add-song'>
        <div class='header'>
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class='search-input-wrapper'>
          <SearchInput v-model='query'/>
        </div>
        <div v-show='!query'>
          <Switches v-model='currentIndex' :items='["播放历史","搜索历史"]'/>
          <div class='list-wrapper'>
            <Scroll class='list-scroll' ref='scrollRef' v-if='currentIndex === 0'>
              <div class='list-inner'>
                <SongList :songs='playHistory' @select='selectSongList'/>
              </div>
            </Scroll>
            <Scroll class='list-scroll' ref='scrollRef' v-if='currentIndex === 1'>
              <div class='list-inner'>
                <SearchList :searchHistory='searchHistory' :showDelete='false' @selectItem='addQuery'/>
              </div>
            </Scroll>
          </div>
        </div>
        <div class='search-result' v-show='query'>
          <Suggest :query='query' :show-singer='false' @selectSong='selectSuggest'/>
        </div>
        <Message ref='messageRef'>
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class="text">1首歌曲已经添加到播放列表</span>
          </div>
        </Message>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import SearchInput from '@/components/Search/SearchInput'
import Suggest from '@/components/Search/Suggest'
import Switches from '@/components/base/Switches/Switches'
import Scroll from '@/components/WrapperScroll'
import SearchList from '@/components/Search/SearchList'
import SongList from '@/components/base/SongList/SongList'
import Message from '@/components/base/Message/Message'
import { useStore } from 'vuex'

export default {
  name: 'AddSong',
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SearchList,
    SongList,
    Message
  },
  setup() {
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const messageRef = ref(null)

    const store = useStore()

    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)

    const refreshScroll = () => {
      scrollRef.value.scroll.refresh()
    }

    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    const show = async () => {
      visible.value = true
      await nextTick()
      refreshScroll()
    }

    const hide = () => {
      visible.value = false
    }

    const showMessage = () => {
      messageRef.value.show()
    }

    const addQuery = (value) => {
      query.value = value
    }

    // 选中搜索结果列表中的歌曲
    const selectSuggest = (song) => {
      addSong(song)
    }

    // 选中播放历史列表中的歌曲
    const selectSongList = ({ item }) => {
      addSong(item)
    }

    // 添加当前点击歌曲到播放列表
    const addSong = (song) => {
      store.dispatch('addSong', song)
      showMessage()
    }

    return {
      visible,
      query,
      currentIndex,
      searchHistory,
      playHistory,
      scrollRef,
      messageRef,
      show,
      hide,
      addQuery,
      selectSuggest,
      selectSongList
    }
  }
}
</script>

<style lang='scss' scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-input-wrapper {
    margin: 20px;
  }

  .list-wrapper {
    position: absolute;
    top: 156px;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }
}
.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;

  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }

  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
