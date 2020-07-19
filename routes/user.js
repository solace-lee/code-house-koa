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
  getAllUsers,
  changeRole,
  delUser
} from '../services/user'
import { returnBody } from '../services/common'

@Controller('/user')
export default class UserRouter {
    @Get('/info')
    async userLoginAndInfo (ctx, next) {
      const openid = ctx.request.header.authorization
      const user = await findAndCreatUser(openid)
      if (user) return(ctx.body = returnBody(200, user, '登陆成功'))
      return ctx.body = returnBody(500, '', '获取用户信息失败')
    }

    @Get('/getalluser')
    @Auth(2)
    async allUser (ctx, next) {
      ctx.body = await getAllUsers(ctx.query.hotkey, ctx.query.page)
    }

    @Put('/changerole')
    @Auth(2)
    @Required({
      body: ['newRole', 'userId']
    })
    async setRole (ctx, next) {
      return ctx.body = await changeRole(ctx.request.body.userId, ctx.request.body.newRole)
    }

    @Delete('/deleteuser')
    @Auth(2)
    async adminDelUser (ctx, next) {
      if (ctx.query.userid && (ctx.query.userid !== ctx.request.header.authorization)) {
        return ctx.body = await delUser(ctx.query.userid)
      } else {
        ctx.body = returnBody(400, '', '用户ID有误')
      }
    }
}