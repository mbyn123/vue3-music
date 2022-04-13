import storage from 'good-storage'

// 获取
export const load = (key) => {
  return storage.get(key, [])
}

// 存储
export const save = (item, key, compare, maxLength) => {
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLength)
  storage.set(key, items)
  return items
}

// 删除
export const remove = (key, compare) => {
  const items = storage.get(key, [])
  deleteArray(items, compare)
  storage.set(key, items)
  return items
}

// 清空
export const clear = (key) => {
  storage.remove(key)
  return []
}

// 存储时
const insertArray = (arr, val, compare, maxLength) => {
  // 获取当前操作数据的索引
  const index = arr.findIndex(compare)
  console.log(index, 'text')
  if (index === 0) {
    return
  }
  // 如果存在就删除
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 不存在就添加到数组的最前面
  arr.unshift(val)
  // 如果数组超过了最大长度，就删除最后一项
  if (maxLength && arr.length > maxLength) {
    arr.pop()
  }
}

// 删除时
const deleteArray = (arr, compare) => {
  // 获取当前操作数据的索引
  const index = arr.findIndex(compare)
  // 如果存在就删除
  if (index > -1) {
    arr.splice(index, 1)
  }
}
