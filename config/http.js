import axios from 'axios'
// 引入Base64

export class Interceptors {
  instance
  constructor () {
    this.instance = axios.create({
      baseURL: 'https://css.feiyanmath.com',
      timeout: 20000,
      headers: {
        post: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    })
    this.initInterceptors()
    // return this.instance
  }

  getInterceptors () {
    return this.instance
  }

  initInterceptors () {
    // 请求前拦截器
    this.instance.interceptors.request.use((config) => {
      // const an = this.Base64.encode('student:student')
      // const bn = 'Basic ' + an
      // config.headers.Authorization = bn
      return config
    })

    this.instance.interceptors.response.use(
      (response) => {
        // 对响应数据做点什么
        // 加到时器主要是为了 展示Loading效果 项目中应去除
        // setTimeout(() => {
        // store.commit('SET_LOADING', false);
        // }, 300)
        return response
      },
      // 对响应错误做点什么
      (error) => {
        if (error.response) {
          // 如果返回401 即没有权限，跳到登录页重新登录
          if (error.response.status === 401) {
          }
        } else {
        }
        return Promise.reject(error)
      }
    )
  }
}
