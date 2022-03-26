<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImagesStyle">
      <div class="play-btn-wrapper">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <Scroll class="list">
      <div class="song-list-wrapper">
        <SongList :songs="song"/>
      </div>
    </Scroll>
  </div>
</template>

<script>
import SongList from '@/components/base/SongList/SongList'
import Scroll from '@/components/base/Scroll/Scroll'

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
    pic: String
  },
  components: {
    SongList,
    Scroll
  },
  mounted() {
    console.log(this.title)
  },
  computed: {
    bgImagesStyle() {
      return {
        paddingTop: '70%',
        backgroundImage: `url(${this.pic})`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  border: 1px solid green;

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
    border: 1px solid red;
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
    transform-origin: top;
    background-size: cover;
    border: 1px solid red;

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
  }

  .list {
    border: 1px solid red;
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
