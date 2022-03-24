import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from './components/base/Loading/directive'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App).use(store).use(router)
  .directive('loading', loadingDirective)
  .use(lazyPlugin, { loading: require('@/assets/images/default.png'), error: require('@/assets/images/default.png') })
  .mount('#app')
