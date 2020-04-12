import {
    Controller,
    Post,
    Required,
    Get,
    Log,
    Auth
} from '../decorator/router'

import { checkPassword, addNewUser } from '../services/user'

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

      if (match) {
          return (ctx.body = {
            success: true,
            resMsg: '',
            data: {
              id: user._id,
              role: user.role,
              headImg: user.headimg,
              username: user.username
            }
          })
        }
    
        return (ctx.body = {
          success: false,
          resMsg: '账号或密码错误',
          data: ''
        })
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
      ctx.body = {
          success: true,
          resMsg: '查询成功',
          data: ctx.request.body.userinfo
      }
    }
}