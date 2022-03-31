export const shuffle = (source) => {
  const arr = source.slice() // 避免修改原数据，返回一个新的数组
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, j, i)
  }
  return arr
}

// 获取随机数
const getRandomInt = (max) => {
  return Math.floor(Math.random() * (max + 1))
}

// 交换位置
const swap = (arr, j, i) => {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

export const formatTime = (num) => {
  num = num | 0
  const minute = ((num / 60 | 0) + '').padStart(2, '0')
  const second = (num % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
