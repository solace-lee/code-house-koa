import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Auth
} from '../decorator/router'

import { returnBody } from '../services/common'
import {
  getParentApply,
  getCount,
  addToBlack,
  applyRead,
  setApplyPass,
  checkHistory
} from '../services/apply'

@Controller('/apply')
export default class ApplyRouter {
  @Get('/parent')
  @Auth(2)
  async getParentApplyList (ctx, next) {
    // 获取家长的申请列表
    return ctx.body = await getParentApply(ctx)
  }

  @Get('/count')
  @Auth(2)
  async getParentCount (ctx, next) {
    // 获取家长申请的总条数
    return ctx.body = await getCount(ctx)
  }

  @Put('/addBlack')
  @Auth(2)
  async addToBlackList (ctx, next) {
    // 将家长放入黑名单
    return ctx.body = await addToBlack(ctx)
  }

  @Put('/setRead')
  @Auth(2)
  async setApplyRead (ctx, next) {
    // 将申请置为已读（忽略状态）
    return ctx.body = await applyRead(ctx.request.body.applyId)
  }

  @Put('/applyPass')
  @Auth(2)
  async setPass (ctx, next) {
    // 通过家长的查询申请
    return ctx.body = await setApplyPass(ctx)
  }

  @Get('/checkHistory')
  @Auth(2)
  async getCheckHistory (ctx, next) {
    // 获取家长的查询历史记录
    return ctx.body = await checkHistory(ctx)
  }
}