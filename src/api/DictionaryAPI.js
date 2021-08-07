import request from '@/utils/request'

export function getDictionaryList(data) {
    return request({
      url: '/API/Dictionary/GetDictionary',
      method: 'post',
      data
    })
  }

  export function saveDictionary(data){
    return request({
      url:"/API/Dictionary/SaveDictionary",
      method:"post",
      data
    })
  }

  export function deleteDictionary(data){
    return request({
      url:"/API/Dictionary/DeleteDictionary",
      method:"post",
      data
    })
  }