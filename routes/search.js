import {
    Controller,
    Required,
    Post,
    Auth,
    Get,
    Log
} from '../decorator/router'

import { findCompany, adminFindCompany } from '../services/searchService'

@Controller('/search')
export default class SearchPage {
  @Get('/companylist')
  @Auth(1)
  @Log
  async searchFromKey (ctx, next) {
    const x = await findCompany(ctx.query.key)
    ctx.type = 'text/json; charset=utf-8'
    ctx.body = x
    await next()
  }

  @Post('/adminCompanyList')
  @Auth(2)
  @Required({
    body: ['page']
  })
  async adminList (ctx, next) {
    const x = await adminFindCompany(ctx.request.body)
    ctx.body = x
  }
}