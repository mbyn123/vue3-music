<template>
  <div class='search'>
    <div class='search-input-wrapper'>
      <SearchInput v-model='query'/>
    </div>
    <Scroll class='search-content' v-show='!query' ref='scrollRef'>
      <div>
        <div class='hot-keys'>
          <h1 class='title'>热门搜索</h1>
          <ul>
            <li class='item' v-for='item in hotKeyList' :key='item.id' @click='addQuery(item.key)'>
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class='search-history' v-show='searchHistory.length'>
          <h1 class='title'>
            <span class='text'>搜索历史</span>
            <span class='clear' @click='showConfirm'>
              <i class='icon-clear'/>
            </span>
          </h1>
          <SearchList :searchHistory='searchHistory' @selectItem='addQuery' @deleteItem='deleteItem'/>
          <Confirm ref='confirmRef' text='确认清空搜索历史？' confirm-text='清空' @confirm='confirm'/>
        </div>
      </div>
    </Scroll>
    <!--搜索结果-->
    <div class='search-result' v-show='query'>
      <Suggest :query='query' @selectSong='selectSong' @selectSinger='selectSinger'/>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="singerDetail"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import SearchInput from '@/components/Search/SearchInput'
import Suggest from '@/components/Search/Suggest'
import SearchList from '@/components/Search/SearchList'
import Scroll from '@/components/base/Scroll/Scroll'
import Confirm from '@/components/base/Confirm/Confirm'
import { getHotKeys } from '@/service/search'
import { computed, nextTick, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import useSearchHistory from '@/components/Search/useSearchHistory'

export default {
  components: {
    Scroll,
    SearchInput,
    Suggest,
    SearchList,
    Confirm
  },
  setup() {
    const query = ref('')
    const hotKeyList = ref([])
    const singerDetail = ref(null)
    const scrollRef = ref(null)
    const confirmRef = ref(null)

    const store = useStore()
    const router = useRouter()
    const { saveHistory, deleteHistory, clearHistory } = useSearchHistory()

    const searchHistory = computed(() => store.state.searchHistory)

    watch(query, async (newQuery) => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })

    const refreshScroll = () => {
      scrollRef.value.scroll.refresh()
    }

    getHotKeys().then(res => {
      hotKeyList.value = res.hotKeys
    })

    const addQuery = (value) => {
      console.log('va', value)
      query.value = value.trim()
    }

    //  选中搜索结果歌曲
    const selectSong = (value) => {
      saveHistory(query.value)
      store.dispatch('addSong', value)
    }
    //  选中搜索结果歌手
    const selectSinger = (value) => {
      saveHistory(query.value)
      singerDetail.value = value
      cacheSinger(value)
      router.push({
        path: `/search/${value.mid}`
      })
    }

    const cacheSinger = (singer) => {
      storage.session.set(SINGER_KEY, singer)
    }
    // 删除搜索历史
    const deleteItem = (value) => {
      deleteHistory(value)
    }

    const showConfirm = () => {
      confirmRef.value.show()
    }

    // 清空搜索历史
    const confirm = () => {
      clearHistory()
    }

    return {
      query,
      hotKeyList,
      singerDetail,
      searchHistory,
      scrollRef,
      confirmRef,
      addQuery,
      selectSong,
      selectSinger,
      deleteItem,
      showConfirm,
      confirm
    }
  }
}

</script>
<style lang='scss' scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;

  .search-input-wrapper {
    margin: 20px;
  }

  .search-content {
    flex: 1;
    overflow: hidden;

    .hot-keys {
      margin: 0 20px 20px 20px;

      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }

      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }

    .search-history {
      position: relative;
      margin: 0 20px;

      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;

        .text {
          flex: 1;
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
  }

  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
