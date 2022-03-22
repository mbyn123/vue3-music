<template>
    <div>1</div>
</template>

<script>
import { getRecommend } from '@/service/recommend.js'
export default {
    async created() {
        const res = await getRecommend()
        console.log(res)
    }
}
</script>

<style lang="scss" scoped></style>
