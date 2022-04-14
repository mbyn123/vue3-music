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
            <Scroll class='list-scroll' v-if='currentIndex === 0'>
              <div class='list-inner'>
                <SongList :songs='playHistory'/>
              </div>
            </Scroll>
            <Scroll class='list-scroll' v-if='currentIndex === 1'>
              <div class='list-inner'>
                <SearchList :searchHistory='searchHistory' :showDelete='false'/>
              </div>
            </Scroll>
          </div>
        </div>
        <div class='search-result' v-show='query'>
          <Suggest :query='query' :show-singer='false'/>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed, ref } from 'vue'
import SearchInput from '@/components/Search/SearchInput'
import Suggest from '@/components/Search/Suggest'
import Switches from '@/components/base/Switches/Switches'
import Scroll from '@/components/WrapperScroll'
import SearchList from '@/components/Search/SearchList'
import SongList from '@/components/base/SongList/SongList'
import { useStore } from 'vuex'

export default {
  name: 'AddSong',
  components: {
    SearchInput,
    Suggest,
    Switches,
    Scroll,
    SearchList,
    SongList
  },
  setup() {
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const store = useStore()

    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)

    const show = () => {
      visible.value = true
    }
    const hide = () => {
      visible.value = false
    }

    return {
      visible,
      query,
      currentIndex,
      searchHistory,
      playHistory,
      show,
      hide
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
    border: 1px solid;
  }

  .list-wrapper {
    position: absolute;
    top: 156px;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid red;

    .list-scroll {
      height: 100%;
      overflow: hidden;
      border: 1px solid;

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
    border: 1px solid red;
  }
}
</style>
