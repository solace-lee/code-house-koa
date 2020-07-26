import {
    Controller,
    Post,
    Required,
    Get,
    Delete,
    Put,
    Log,
    Auth
} from '../decorator/router'

import {
  findAndCreatUser,
  saveUserInfo,
  getUserInfo,
  changeRole,
  delUser
} from '../services/user'
import { returnBody } from '../services/common'

@Controller('/user')
export default class UserRouter {
    @Get('/info')
    @Auth(1)
    async userLoginAndInfo (ctx, next) {
      // Auth的时候就会创建用户信息，这里只需要去查找就可以了
      const openid = ctx.request.header.authorization
      const user = await findAndCreatUser(openid)
      if (user) return(ctx.body = returnBody(200, user, '登陆成功'))
      return ctx.body = returnBody(500, '', '获取用户信息失败')
    }

    @Post('/saveUserInfo')
    @Required({
      body: ['nickName']
    })
    @Auth(1)
    async saveInfo (ctx, next) {
      // 保存获取到的微信个人信息
      ctx.body = await saveUserInfo(ctx.request)
    }

    @Post('/getInfoWithPw')
    @Required({
      body: ['username', 'password']
    })
    async usePwgetInfo (ctx, next) {
      // 根据用户名和密码获取用户信息,给网页使用，上传数据前获取用户信息
      ctx.body = await getUserInfo(ctx.request)
    }

    // @Put('/changerole')
    // @Auth(2)
    // @Required({
    //   body: ['newRole', 'userId']
    // })
    // async setRole (ctx, next) {
    //   return ctx.body = await changeRole(ctx.request.body.userId, ctx.request.body.newRole)
    // }

    // @Delete('/deleteuser')
    // @Auth(2)
    // async adminDelUser (ctx, next) {
    //   if (ctx.query.userid && (ctx.query.userid !== ctx.request.header.authorization)) {
    //     return ctx.body = await delUser(ctx.query.userid)
    //   } else {
    //     ctx.body = returnBody(400, '', '用户ID有误')
    //   }
    // }
}