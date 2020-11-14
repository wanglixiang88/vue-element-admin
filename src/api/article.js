import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/API/UserInfo/GetUserInfoList',
    method: 'post',
    data
  })
}

export function saveUserInfo(data) {
  return request({
    url: '/API/UserInfo/SaveUserInfo',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/API/UserInfo/DeleteUser',
    method: 'post',
    data
  })
}

export function ChangUserVaild(data) {
  return request({
    url: '/API/UserInfo/ChangUserVaild',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}
