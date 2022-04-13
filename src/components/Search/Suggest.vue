<template>
  <div class='suggest' ref='rootRef' v-loading:[loadingText]='loading' v-noResult:[noResultText]='noResult'>
    <ul class='suggest-list'>
      <!--歌手-->
      <li class='suggest-item' v-if='singer' @click='selectSinger(singer)'>
        <div class='icon'>
          <i class='icon-mine'></i>
        </div>
        <div class='name'>
          <p class='text'>{{ singer.name }}</p>
        </div>
      </li>
      <!--歌曲-->
      <li class='suggest-item' v-for='item in songs' :key='item.id' @click='selectSong(item)'>
        <div class='icon'>
          <i class='icon-music'></i>
        </div>
        <div class='name'>
          <p class='text'>{{ item.singer }} -- {{ item.name }}</p>
        </div>
      </li>
      <li class='suggest-item' v-loading:[loadingText]='pullUpLoading'/>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'
import usePullUpLoad from '@/components/Search/usePullUpLoad'

export default {
  name: 'Suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  emits: ['emit'],
  setup(props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')
    const manualLoading = ref(false)

    const loading = computed(() => !singer.value && !songs.value.length)

    const noResult = computed(() => !singer.value && !songs.value.length && !hasMore.value)

    const pullUpLoading = computed(() => isPullUpLoad.value && hasMore.value)

    const preventPullUpLoad = computed(() => {
      return loading.value || manualLoading.value
    })

    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(searchMore, preventPullUpLoad)

    watch(() => props.query, async (newQuery) => {
      if (!newQuery) {
        return
      }
      await searchFirst()
    })

    const searchFirst = async () => {
      if (!props.query) {
        return
      }
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true
      // 搜索歌曲 歌手
      const res = await search(props.query, page.value, props.showSinger)
      // 获取歌曲的播放地址
      songs.value = await processSongs(res.songs.filter(i => i.mid))
      singer.value = res.singer
      hasMore.value = res.hasMore
      await nextTick()
      await makeItScrollable()
    }

    // 上拉加载
    async function searchMore() {
      if (!props.query || !hasMore.value) {
        return
      }
      page.value++
      const res = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(res.songs)
      hasMore.value = res.hasMore
      await nextTick()
      await makeItScrollable()
    }

    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        manualLoading.value = true
        await searchMore()
        manualLoading.value = false
      }
    }

    const selectSong = (value) => {
      emit('selectSong', value)
    }

    const selectSinger = (value) => {
      emit('selectSinger', value)
    }

    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText,
      rootRef,
      pullUpLoading,
      selectSong,
      selectSinger
    }
  }
}
</script>

<style lang='scss' scoped>
.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .icon {
        flex: 0 0 30px;
        width: 30px;

        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }

      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;

        .text {
          @include no-wrap()
        }
      }
    }
  }
}
</style>
