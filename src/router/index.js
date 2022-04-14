import { createRouter, createWebHashHistory } from 'vue-router'

const userCenter = () => import('@/views/userCenter.vue')
const Recommend = () => import('@/views/recommend.vue')
const Singer = () => import('@/views/singer.vue')
const TopList = () => import('@/views/topList.vue')
const Search = () => import('@/views/search.vue')
const SingerDetail = () => import('@/views/singerDetail.vue')
const Album = () => import('@/views/album.vue')
const TopListDetail = () => import('@/views/topListDetail.vue')

const routes = [{
  path: '/',
  redirect: '/recommend'
}, {
  path: '/recommend',
  component: Recommend,
  children: [
    {
      path: ':id',
      component: Album
    }
  ]
}, {
  path: '/singer',
  component: Singer,
  children: [
    {
      path: ':id',
      component: SingerDetail
    }
  ]
}, {
  path: '/topList',
  component: TopList,
  children: [
    {
      path: ':id',
      component: TopListDetail
    }
  ]
}, {
  path: '/search',
  component: Search,
  children: [
    {
      path: ':id',
      component: SingerDetail
    }
  ]
}, {
  path: '/user',
  components: {
    user: userCenter
  }
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
