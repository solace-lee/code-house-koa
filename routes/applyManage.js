import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Auth
} from '../decorator/router'

import { returnBody } from '../services/common'
import { getParentApply } from '../services/apply'

@Controller('/apply')
export default class ApplyRouter {
  @Get('/parent')
  @Auth(2)
  async getParentApplyList (ctx, next) {
    return ctx.body = await getParentApply(ctx)
  }
}