import { Interceptors } from '../config/http'
import wechatConfig from '../config/wechatConfig'

const http = new Interceptors().getInterceptors()

export const getUnionId = async (ctx) => {
  if (ctx.query && ctx.query.code) {
    // 拿到code
    const { openid, unionid, session_key } = await _getWechatAccess(ctx.query.code, wechatConfig.appid, wechatConfig.appsecret)
    return {
      openid: openid || '',
      unionid: unionid || '',
      session_key: session_key || '',
      token: ''
    }
  } else {
    ctx.res.writeHead(500)
  }
}

const _getWechatAccess = async (js_code, appid, secret) => { // 访问微信接口获取unionid
  const query = {
    params: {
      appid,
      secret,
      js_code,
      grant_type: 'authorization_code'
    }
  }
  const { status, data } = await http.get(wechatConfig.code2Session, query)
  console.log(data);
  if (status === 200) {
    return data
  } else {
    return {
      openid: '',
      unionid: ''
    }
  }
}