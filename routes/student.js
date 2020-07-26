import {
    Controller,
    Post,
    Get,
    Delete,
    Put,
    Auth
} from '../decorator/router'

import { returnBody } from '../services/common'
import { uploadList, getStudent, getMark, deletMark } from '../services/student'

@Controller('/student')
export default class UserRouter {
    @Post('/upload')
    @Auth(2)
    async upStudent (ctx, next) {
      // 上传学生成绩(openid)
      const { datas, userinfo } = ctx.request.body
      const x = await uploadList(datas, userinfo.openid)
      return ctx.body = x
    }

    // @Get('/get')
    // async findStudent (ctx, next) {
    //   const keyword = ctx.query.hotkey
    //   if (keyword) {
    //     const x = await getStudent(keyword)
    //     return ctx.body = x
    //   } else {
    //     return ctx.body = returnBody(400, '', '没有数据')
    //   }
    // }

    // @Get('/getAll')
    // async findMark (ctx, next) {
    //   const x = await getMark(ctx.query.hotkey, ctx.query.page)
    //   return ctx.body = x
    // }


    // @Delete('/deletmark')
    // async deletAll (ctx, next) {
    //   ctx.body = await deletMark(ctx.query.mark)
    // }
}