<template>
    <Header />
    <Tab />
    <router-view></router-view>
</template>

<script>
import Header from '@/components/Header/Header'
import Tab from '@/components/Tab/Tab'
export default {
    components: {
        Header,
        Tab
    }
}
</script>

<style lang='scss'>
</style>
