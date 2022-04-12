<template>
  <div class='search'>
    <div class='search-input-wrapper'>
      <SearchInput v-model='query'/>
    </div>
    <div class='search-content' v-show='!query'>
      <div class='hot-keys'>
        <h1 class='title'>热门搜索</h1>
        <ul>
          <li class='item' v-for='item in hotKeyList' :key='item.id' @click='addQuery(item.key)'>
            <span>{{ item.key }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class='search-result' v-show='query'>
      <Suggest :query='query'/>
    </div>
  </div>
</template>

<script>
import SearchInput from '@/components/Search/SearchInput'
import Suggest from '@/components/Search/Suggest'
import { getHotKeys } from '@/service/search'
import { ref } from 'vue'

export default {
  components: {
    SearchInput,
    Suggest
  },
  setup() {
    const query = ref('')
    const hotKeyList = ref([])
    getHotKeys().then(res => {
      hotKeyList.value = res.hotKeys
    })

    const addQuery = (value) => {
      query.value = value
    }

    return {
      query,
      hotKeyList,
      addQuery
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
  }

  .search-result{
    flex: 1;
    overflow: hidden;
  }
}
</style>
