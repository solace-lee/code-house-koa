import {
    Controller,
    Required,
    Post,
    Auth,
    Get,
    Log
} from '../decorator/router'

import { findStudent, adminFindCompany } from '../services/searchService'

@Controller('/search')
export default class SearchPage {
  @Get('/student')
  @Auth(1)
  async searchFromKey (ctx, next) {
    const x = await findStudent(ctx.query, ctx.request.body.userinfo)
    ctx.type = 'text/json; charset=utf-8'
    ctx.body = x
    await next()
  }

  // @Post('/adminCompanyList')
  // @Auth(2)
  // @Required({
  //   body: ['page']
  // })
  // async adminList (ctx, next) {
  //   const x = await adminFindCompany(ctx.request.body)
  //   ctx.body = x
  // }
}