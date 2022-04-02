<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <!--背景图-->
    <div ref="bgImageRef" :style="bgImagesStyle" class="bg-image">
      <div class="play-btn-wrapper" :style='playBtnStyle'>
        <div class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div :style="filterStyle" class="filter"></div>
    </div>
    <!--歌曲列表-->
    <Scroll v-loading="loading" v-noResult:[noResultText]="noResult" :probe-type="3" :style="scrollStyle" class="list"
            @scroll="scroll">
      <div class="song-list-wrapper">
        <SongList :songs="song" @select='selectItem'/>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SongList from '@/components/base/SongList/SongList'
import Scroll from '@/components/base/Scroll/Scroll'

const TITLE_HEIGHT = 40
export default {
  name: 'MusicList',
  props: {
    song: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    }
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0
    }
  },
  components: {
    SongList,
    Scroll
  },
  mounted() {
    this.imageHeight = this.$refs.bgImageRef.clientHeight
    // 计算列表的最大滚动高度
    this.maxTranslateY = this.imageHeight - TITLE_HEIGHT
  },
  computed: {
    playBtnStyle() {
      let display = ''
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    },
    noResult() {
      return !this.loading && !this.song.length
    },
    bgImagesStyle() {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let scale = 1
      let translateZ = 0
      // 如果超过最大滚动高度，就动态修改图片样式
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = '0'
        height = TITLE_HEIGHT + 'px'
        translateZ = 1
      }
      // 如果图片下拉超过最小值，就对图片进行缩放
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }
      return {
        paddingTop,
        zIndex,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale}) translateZ(${translateZ}px)`
      }
    },
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`
      }
    },
    filterStyle() {
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      let blur = 0
      // 滚动条上拉遮罩层模糊效果
      if (scrollY >= 0) {
        blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    }
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    back() {
      this.$router.back()
    },
    scroll(option) {
      this.scrollY = -option.y
    },
    // 播放歌曲,顺序播放
    selectItem({ item, index }) {
      this.selectPlay({ list: this.song, index })
    },
    // 全部随机播放
    random() {
      this.randomPlay(this.song)
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;

  .back {
    position: absolute;
    left: 6px;
    top: 0;
    z-index: 20;
    transform: translateZ(2px);

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    //transform-origin: top;
    background-size: cover;

    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;

      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }

      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }

      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;

    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
