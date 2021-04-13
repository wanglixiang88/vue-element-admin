import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/API/UserInfo/UserLogin',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: '/API/UserInfo/GetUserDetail',
    method: 'get',
    params: { userId }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getAuthMenu() {
  return request({
    url: '/API/users/getMenu',
    method: 'get'
  })
}
