<template>
  <div class='top-list' v-loading='loading'>
    <Scroll class='top-list-content'>
      <ul>
        <li class='item' v-for='item in topList' :key='item.id' @click='selectTopItem(item)'>
          <div class='icon'>
            <img :src='item.pic' alt='' width='100' height='100'>
          </div>
          <ul class='song-list'>
            <li class='song' v-for='(song,index) in item.songList' :key='song.id'>
              <span>{{ index + 1 }}. </span>
              <span>{{ song.singerName }}--{{ song.songName }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="topDetail"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import Scroll from '@/components/WrapperScroll'
import { getTopList } from '@/service/topList'
import storage from 'good-storage'
import { TOP_KEY } from '@/assets/js/constant'

export default {
  components: {
    Scroll
  },
  data() {
    return {
      topList: [],
      loading: true,
      topDetail: {}
    }
  },
  async created() {
    const res = await getTopList()
    this.topList = res.topList
    this.loading = false
  },
  methods: {
    selectTopItem(value) {
      this.topDetail = value
      this.cacheTopDetail(value)
      this.$router.push({
        path: `/topList/${value.id}`
      })
    },
    cacheTopDetail(value) {
      storage.session.set(TOP_KEY, value)
    }
  }
}

</script>
<style lang='scss' scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .top-list-content {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
