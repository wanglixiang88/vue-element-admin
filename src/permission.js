import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 白名单

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面的标题
  document.title = getPageTitle(to.meta.title)

  // 从cookie中取得token
  const hasToken = getToken()

  if (hasToken) { // 如果有token 也就是已经登陆的情况下
    if (to.path === '/login') {
      next({ path: '/' }) // 如果是进入登录页面 则不需要权限 直接进入
      NProgress.done() // 页面导航结束
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0 // 从store中取得用户的 roles, 也就是用户的权限 并且用户的权限数组必须有一个以上
      if (hasRoles) { // 有权限则直接进入
        next()
      } else {
        // 没有权限的话
        try {
          // 获取用户信息
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // 生成可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 将可访问路由添加到路由上
          router.addRoutes(accessRoutes)

          // 进入路由
          next({ ...to, replace: true })
        } catch (error) {
          // 如果出现异常 清空路由
          await store.dispatch('user/resetToken')
          // Message提示错误
          Message.error(error || 'Has Error')
          // 跳到login页面重新登陆
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token 也就是没有登陆的情况下
    // 判断是否是白名单(也就是说不需要登陆就可以访问的路由)
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 其他的一路给我跳到login页面 老老实实的进行登陆
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
