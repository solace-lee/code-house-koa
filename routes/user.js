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
  savePassword,
  getPwStatus,
  inviteStatus,
  createInvite,
  confirmInviteCode,
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

    @Post('/setPassword')
    @Auth(2)
    @Required({
      body: ['username']
    })
    async setUserLoginInfo (ctx, next) {
      // 保存用户账号和密码用于网页登录
      ctx.body = await savePassword(ctx.request)
    }

    @Get('/getPasswordStatus')
    @Auth(2)
    async getStatus (ctx, next) {
      // 查询是否设置了密码
      ctx.body = await getPwStatus(ctx)
    }


    @Get('/getInvite')
    @Auth(2)
    async getInviteStatus (ctx, next) {
      // 查询是否设置了邀请码
      ctx.body = await inviteStatus(ctx)
    }

    @Post('/createCode')
    @Auth(2)
    async createInviteCode (ctx, next) {
      // 创建教师邀请码
      ctx.body = await createInvite(ctx)
    }

    @Put('/confirmInvite')
    @Auth(1)
    async makeConfirmInvite (ctx, next) {
      // 教师邀请码校验
      ctx.body = await confirmInviteCode(ctx)
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