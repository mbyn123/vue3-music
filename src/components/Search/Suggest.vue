<template>
  <div class='suggest' v-loading:[loadingText]='loading' v-noResult:[noResultText]='noResult'>
    <ul class='suggest-list'>
      <li class='suggest-item' v-if='singer'>
        <div class='icon'>
          <i class='icon-mine'></i>
        </div>
        <div class='name'>
          <p class='text'>{{ singer.name }}</p>
        </div>
      </li>
      <li class='suggest-item' v-for='item in songs' :key='item.id'>
        <div class='icon'>
          <i class='icon-music'></i>
        </div>
        <div class='name'>
          <p class='text'>{{ item.singer }} -- {{ item.name }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/song'

export default {
  name: 'Suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')

    const loading = computed(() => !singer.value && !songs.value.length)

    const noResult = computed(() => !singer.value && !songs.value.length && !hasMore.value)

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
    }

    return {
      singer,
      songs,
      loading,
      loadingText,
      noResult,
      noResultText
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
