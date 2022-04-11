<template>
  <div class="recommend" v-loading:[text]="loading">
    <Scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider v-if="sliders.length" :sliders="sliders"/>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in albums" :key="item.id" @click='selectAlbum(item)'>
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{ item.username }}</h2>
                <p class="title">{{ item.title }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="albumDetail"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getRecommend } from '@/service/recommend.js'
import Slider from '@/components/base/Slider/Slider'
import Scroll from '@/components/WrapperScroll'
import storage from 'good-storage'
import { ALBUM_KEY } from '@/assets/js/constant'

export default {
  data() {
    return {
      sliders: [],
      albums: [],
      albumDetail: {},
      text: '加载中...'
    }
  },
  components: {
    Slider,
    Scroll
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length
    }
  },
  async mounted() {
    const res = await getRecommend()
    this.sliders = res.sliders
    this.albums = res.albums
    // console.log(res)
  },
  methods: {
    selectAlbum(value) {
      this.cacheAlbum(value)
      this.albumDetail = value
      this.$router.push({
        path: `/recommend/${value.id}`
      })
    },
    cacheAlbum(value) {
      storage.session.set(ALBUM_KEY, value)
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          padding-right: 20px;
        }

        .text {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .title {
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>
