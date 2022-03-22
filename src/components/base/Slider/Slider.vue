<template>
    <div class="slider">
        <div class="slider-group">
            <div class="slider-page" v-for="item in sliders" :key="item.id">
                <a :href="item.link">
                    <img :src="item.pic">
                </a>
            </div>
        </div>
        <!-- <div class="slider-dots">
            <span class="dot" v-for="(item, index) in sliders" :key="item.id" :class="{'active': currentPageIndex === index}">
            </span>
        </div> -->
    </div>
</template>

<script>
export default {
    props: {
        sliders: {
            type: Array,
            default() {
                return []
            }
        }
    },
    watch: {
        sliders(newVal) {
            console.log(newVal)
        }
    }
}
</script>
<style lang='scss' scoped>
.slider {
    border: 1px solid red;
    min-height: 1px;
    font-size: 0;
    touch-action: pan-y;
    .slider-group {
        .slider-page {
            display: inline-block;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            a {
                display: block;
                width: 100%;
            }
            img {
                display: block;
                width: 100%;
            }
        }
    }
    .slider-dots {
        .dot {
        }
    }
}
</style>
