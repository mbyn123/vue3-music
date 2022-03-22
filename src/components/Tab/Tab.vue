<template>
    <div class="tab">
        <router-link v-for="item in tabData" :key="item.path" :to="item.path" class="tab-item">
            <span class="tab-link">{{item.name}}</span>
        </router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tabData: [
                {
                    name: '推荐',
                    path: '/recommend'
                },
                {
                    name: '歌手',
                    path: '/singer'
                },
                {
                    name: '排行',
                    path: '/topList'
                },
                {
                    name: '搜索',
                    path: '/search'
                }
            ]
        }
    }
}
</script>
<style lang='scss' scoped>
.tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;
    .tab-item {
        flex: 1;
        text-align: center;
        .tab-link {
            color: $color-text-l;
            padding-bottom: 5px;
        }

        &.router-link-active {
            .tab-link {
                color: $color-theme;
                border-bottom: 2px solid $color-theme;
            }
        }
    }
}
</style>
