import {
  Controller,
  Post,
  Get,
  Log,
  Required,
} from '../decorator/router'
import { getUnionId } from '../services/wxServer'

@Controller('/wechat')
export default class Wechat {
  @Get('/getUnionId')
  @Log
  async getParentsLogin (ctx, next) {
    const res = await getUnionId(ctx)
    ctx.body = {
      datas: res,
      respCode: 0,
      respMsg: '成功'
    }
  }
}