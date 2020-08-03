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
  setApplyPass
} from '../services/apply'

@Controller('/apply')
export default class ApplyRouter {
  @Get('/parent')
  @Auth(2)
  async getParentApplyList (ctx, next) {
    return ctx.body = await getParentApply(ctx)
  }

  @Get('/count')
  @Auth(2)
  async getParentCount (ctx, next) {
    return ctx.body = await getCount(ctx)
  }

  @Put('/addBlack')
  @Auth(2)
  async addToBlackList (ctx, next) {
    return ctx.body = await addToBlack(ctx)
  }

  @Put('/setRead')
  @Auth(2)
  async setApplyRead (ctx, next) {
    return ctx.body = await applyRead(ctx)
  }

  @Put('/applyPass')
  @Auth(2)
  async setPass (ctx, next) {
    return ctx.body = await setApplyPass(ctx)
  }
}