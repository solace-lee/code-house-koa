import {
    Controller,
    Required,
    Post,
    Auth,
    Get,
    Log
} from '../decorator/router'

import {
  findStudent,
  getTeacherStudentList,
  getExamInfo,
  getStuInfo
} from '../services/searchService'

@Controller('/search')
export default class SearchPage {
  @Get('/student')
  @Auth(1)
  async searchFromKey (ctx, next) {
    ctx.type = 'text/json; charset=utf-8'
    ctx.body = await findStudent(ctx.query, ctx.request.body.userinfo)
    await next()
  }

  @Get('/teacherStudent')
  @Auth(2)
  async findTeacherStudent (ctx, next) {
    ctx.body = await getTeacherStudentList(ctx)
  }

  @Get('/examInfo')
  @Auth(2)
  async findExamList (ctx, next) {
    ctx.body = await getExamInfo(ctx)
  }

  @Get('/stuInfo')
  @Auth(2)
  async findStudentInfo (ctx, next) {
    ctx.body = await getStuInfo(ctx)
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