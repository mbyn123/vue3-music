import { createRouter, createWebHashHistory } from 'vue-router'

const Recommend = () => import('@/views/recommend.vue')
const Singer = () => import('@/views/singer.vue')
const TopList = () => import('@/views/topList.vue')
const Search = () => import('@/views/search.vue')

const routes = [{
  path: '/',
  redirect: '/recommend'
}, {
  path: '/recommend',
  component: Recommend
}, {
  path: '/singer',
  component: Singer
}, {
  path: '/topList',
  component: TopList
}, {
  path: '/search',
  component: Search
}]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
