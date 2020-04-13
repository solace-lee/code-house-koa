import {
    Controller,
    Post,
    Required,
    Get,
    Log,
    Auth
} from '../decorator/router'

import { checkPassword, addNewUser } from '../services/user'
import { returnBody } from '../services/common'

@Controller('/user')
export default class UserRouter {
    @Post('/login')
    @Required({
      body: ['username', 'password']
    })
    async userLogin (ctx, next) {
      const { username, password } = ctx.request.body
      const data = await checkPassword(username, password)
      const { user, match } = data

      if (match) (ctx.body = returnBody(200, {id: user._id}, '账号或密码错误'))
      ctx.body = returnBody(400, '', '账号或密码错误')
    }

    @Post('/sign')
    @Required({
      body: ['username', 'password']
    })
    async userSign (ctx, next) {
      const { username, password } = ctx.request.body
      const x = await addNewUser(username, password)
      ctx.body = x
    }

    @Get('/userinfo')
    @Auth(1)
    async userInfo (ctx, next) {
      ctx.body = returnBody(200, ctx.request.body.userinfo, '查询成功')
    }
}