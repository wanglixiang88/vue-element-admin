import request from '@/utils/request'

export function getMenuList(data) {
    return request({
      url: '/API/Menu/GetAllMenu',
      method: 'post',
      data
    })
  }