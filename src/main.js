import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from '@/components/base/Loading/directive'
import NoResultDirective from '@/components/base/NoResult/directive'
// 引入全局样式文件
import '@/assets/scss/index.scss'
import { load, saveAll } from '@/assets/js/arrayStore'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/song'

const favoriteList = load(FAVORITE_KEY)
if (favoriteList.length > 0) {
  processSongs(favoriteList).then(res => {
    store.commit('setFavoriteList', res)
    saveAll(res, FAVORITE_KEY)
  })
}

const playHistory = load(PLAY_KEY)
if (playHistory.length > 0) {
  processSongs(playHistory).then(res => {
    store.commit('setPlayHistory', res)
    saveAll(res, PLAY_KEY)
  })
}

createApp(App).use(store).use(router)
  .directive('loading', loadingDirective).directive('noResult', NoResultDirective)
  .use(lazyPlugin, { loading: require('@/assets/images/default.png'), error: require('@/assets/images/default.png') })
  .mount('#app')
