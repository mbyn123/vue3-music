// import { createApp } from 'vue'
import Loading from './Loading'
import createDirective from '@/assets/js/createDirective'
// import { addClass, removeClass } from '@/assets/js/dom.js'
//
// const relativeCls = 'g-relative'
//
// const loadingDirective = {
//   // 指令挂载时
//   mounted(el, binding) {
//     const app = createApp(Loading)
//     // 挂载loading组件
//     const instance = app.mount(document.createElement('div'))
//     // 由于loading组件只会挂载一次，所以使用将组件缓存在当前组件的实例上
//     el.instance = instance
//     // 获取指令传入的参数
//     const title = binding.arg
//     // 修改loading组件中的文案
//     if (typeof title !== 'undefined') {
//       instance.setTitle(title)
//     }
//     // 当绑定的值为true时
//     if (binding.value) {
//       append(el)
//     }
//   },
//   // 指令更新时
//   updated(el, binding) {
//     // 修改提示文案
//     const title = binding.arg
//     if (typeof title !== 'undefined') {
//       el.instance.setTitle(title)
//     }
//     // 修改loading组件的状态
//     if (binding.value !== binding.oldValue) {
//       binding.value ? append(el) : remove(el)
//     }
//   }
// }
//
// // 将loading组件挂载到当前使用的组件中
// function append(el) {
//   // 获取当前组件的样式
//   const style = getComputedStyle(el)
//   // 如果当前组件的样式中没有position属性，就添加一个class
//   if (['absoluted', 'fixed', 'relative'].indexOf(style.position) === -1) {
//     addClass(el, relativeCls)
//   }
//   el.appendChild(el.instance.$el)
// }
//
// // 将loading组件从当前组件中移除
// function remove(el) {
//   removeClass(el, relativeCls)
//   el.removeChild(el.instance.$el)
// }

const loadingDirective = createDirective(Loading)

export default loadingDirective
