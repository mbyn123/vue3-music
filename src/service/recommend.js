import { get } from './base'

// 推荐列表
export function getRecommend() {
    return get('/api/getRecommend')
}

// 推荐详情
export function getAlbum(album) {
  return get('/api/getAlbum', {
    id: album.id
  })
}
