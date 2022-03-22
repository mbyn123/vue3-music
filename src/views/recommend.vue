<template>
  <div class="recommend">
    <div class="recommend-content">
      <div class="slider-wrapper">
        <div class="slider-content">
          <Slider :sliders="sliders"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getRecommend} from '@/service/recommend.js'
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
      console.log(res)
    }
  }
</script>

<style lang="scss" scoped>
  .recommend {
    .recommend-content {
      .slider-wrapper {
        .slider-content {
        }
      }
    }
  }
</style>

