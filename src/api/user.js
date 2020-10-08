import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/API/users/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/API/users/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getAuthMenu(token) {
  return request({
    url: '/API/users/getMenu',
    method: 'get',
    params: { token }
  })
}
