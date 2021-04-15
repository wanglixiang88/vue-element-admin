import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/API/UserRole/GetRoleList',
    method: 'post',
    data
  })
}