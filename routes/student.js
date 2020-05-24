import {
    Controller,
    Post,
    Get,
    Delete,
    Put
} from '../decorator/router'

import { returnBody } from '../services/common'
import { uploadList, getStudent, getMark, deletMark } from '../services/student'

@Controller('/student')
export default class UserRouter {
    @Post('/upload')
    async upStudent (ctx, next) {
      const { datas, userKey } = ctx.request.body
      if (userKey !== '陈老师') {
        return ctx.body = returnBody(400, '', '没有权限')
      } else {
        const x = await uploadList(datas)
        return ctx.body = x
      }
    }

    @Get('/get')
    async findStudent (ctx, next) {
      const keyword = ctx.query.hotkey
      if (keyword) {
        const x = await getStudent(keyword)
        return ctx.body = x
      } else {
        return ctx.body = returnBody(400, '', '没有数据')
      }
    }

    @Get('/getAll')
    async findMark (ctx, next) {
      const x = await getMark(ctx.query.hotkey, ctx.query.page)
      return ctx.body = x
    }


    @Delete('/deletmark')
    async deletAll (ctx, next) {
      ctx.body = await deletMark(ctx.query.mark)
    }
}