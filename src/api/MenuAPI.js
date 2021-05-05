import request from '@/utils/request'

export function getMenuList(data) {
    return request({
      url: '/API/Menu/GetAllMenu',
      method: 'post',
      data
    })
  }

  export function saveMenu(data){
    return request({
      url:"/API/Menu/SaveMenu",
      method:"post",
      data
    })
  }

  export function deleteMenu(data){
    return request({
      url:"/API/Menu/DeleteMenu",
      method:"post",
      data
    })
  }