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
        <div class='search-result'>
          <Suggest :query='query' :show-singer='false'/>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import SearchInput from '@/components/Search/SearchInput'
import Suggest from '@/components/Search/Suggest'
import { ref } from 'vue'

export default {
  name: 'AddSong',
  components: {
    SearchInput,
    Suggest
  },
  setup() {
    const visible = ref(false)
    const query = ref('')

    const show = () => {
      visible.value = true
    }
    const hide = () => {
      visible.value = false
    }

    return {
      visible,
      query,
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
