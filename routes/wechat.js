import {
  Controller,
  Post,
  Get,
  Log,
  Required,
} from '../decorator/router'
import { getUnionId } from '../services/wxServer'
import { Interceptors } from '../config/http'

const http = new Interceptors().getInterceptors()

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