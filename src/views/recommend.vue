<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <div class="slider-content">
          <Slider v-if="sliders.length" :sliders="sliders"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getRecommend } from '@/service/recommend.js'
  import Slider from '@/components/base/Slider/Slider'

  export default {
    data() {
      return {
        sliders: []
      }
    },
    components: {
      Slider
    },
    async mounted() {
      const res = await getRecommend()
      this.sliders = res.sliders
      // console.log(res)
    }
  }
</script>

<style lang="scss" scoped>
  .recommend {
    border: 1px solid green;
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
    }
  }
</style>
