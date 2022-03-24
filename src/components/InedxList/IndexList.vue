<template>
  <Scroll class="index-list" :probeType="2" @scroll="onScroll">
    <ul ref="groupRef">
      <li class="group" v-for="group in data" :key="group.title">
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li class="item" v-for="item in group.list" :key="item.id">
            <img v-lazy="item.pic" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
  </Scroll>
</template>

<script>
  import Scroll from '@/components/base/Scroll/Scroll'
  import useFixed from './useFixed'

  export default {
    name: 'IndexList',
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      Scroll
    },
    setup(props) {
      const { groupRef, fixedTitle, onScroll } = useFixed(props)
      return {
        groupRef,
        fixedTitle,
        onScroll
      }
    }
  }
</script>

<style lang="scss" scoped>
  .index-list {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;

    .group {
      padding-bottom: 30px;

      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }

      .item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;

        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }

        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }

    .fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;

      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
  }
</style>
