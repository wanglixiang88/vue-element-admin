import { constantRoutes } from '@/router'
import { getAuthMenu } from '@/api/user'
import Layout from '@/layout'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) { // 判断是否有权限
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) { // 过滤没有权限的列表 循环过滤 直到没有子路由
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => { // 保存动态路由时 将静态路由和动态路由合并
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
      const component = router.component
      router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve)
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      getAuthMenu().then(response => {
       
        let data = response
        if (response.code !== 1000) {
          this.$message({
            message: '菜单数据加载异常',
            type: 0
          })
        } else {
          data = response.data.menuList
          var str='{"code":1000,"message":"成功","data":[{"id":1,"name":"系统管理员","path":"","redirect":"","component":"Layout","alwaysShow":true,"meta":{"title":"系统管理员","icon":"edit"},"pid":null,"sort":0,"children":[{"id":2,"name":"用户管理","path":"index","component":"user/index","meta":{"title":"用户管理","icon":"edit"}},{"id":2,"name":"角色管理","path":"userRole","component":"user/userRole","meta":{"title":"角色管理","icon":"edit"}},{"id":3,"name":"菜单管理","path":"menu","component":"menu/index","meta":{"title":"菜单管理","icon":"edit"}},{"id":4,"name":"数据字典","path":"dictionaryIndex","component":"menu/dictionaryIndex","meta":{"title":"数据字典","icon":"edit"}}]}]}';

          var date1= JSON.parse(str)
          console.log(date1)

          const asyncRouter = filterAsyncRouter(date1.data)
          commit('SET_ROUTES', asyncRouter)
          resolve(asyncRouter)

        }
      }).catch(error => {
        console.log(error)
      })
    })
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
