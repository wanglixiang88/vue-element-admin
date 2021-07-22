import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/API/UserRole/GetRoleList',
    method: 'post',
    data
  })
}

export function saveRoleInfo(data){
  return request({
    url:"/API/UserRole/SaveRoleInfo",
    method:"post",
    data
  })
}

export function deleteRoleInfo(data){
  return request({
    url:"/API/UserRole/DeleteRole",
    method:"post",
    data
  })
}

export function getRoleMenuList(data){
  return request({
    url:"/API/UserRole/GetRoleMenu",
    method:"post",
    data
  })
}

export function saveRolePower(data){
  return request({
    url:"/API/UserRole/SavePermissionRole",
    method:"post",
    data
  })
}