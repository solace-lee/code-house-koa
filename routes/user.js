import {
    Controller,
    Post,
    Required,
    Get,
    Log
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
            data: {
              _id: user._id,
              role: user.role,
              headImg: user.headimg,
              username: user.username
            }
          })
        }
    
        return (ctx.body = {
          success: false,
          data: '账号或密码错误'
        })
    }

    @Post('/sign')
    @Required({
      body: ['username', 'password']
    })
    async userSign (ctx, next) {
      const { username, password, role } = ctx.request.body
      const x = await addNewUser(username, password, role)
      ctx.body = x
    }
}