// 添加class
export function addClass(el, className) {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

// 移除class
export function removeClass(el, className) {
  el.classList.remove(className)
}
