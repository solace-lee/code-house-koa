import {
    Controller,
    Required,
    Delete,
    Put,
    Auth,
    Get,
    Log
} from '../decorator/router'

import {
  findStudent,
  getTeacherStudentList,
  getExamInfo,
  getStuInfo,
  examHidden,
  examDelet
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

  @Put('/setHidden')
  @Auth(2)
  async setExamHidden (ctx, next) {
    ctx.body = await examHidden(ctx)
  }

  @Delete('/deletExam/:id')
  @Auth(2)
  async toDeletExam (ctx, next) {
    ctx.body = await examDelet(ctx)
  }

  @Get('/stuInfo')
  @Auth(2)
  async findStudentInfo (ctx, next) {
    ctx.body = await getStuInfo(ctx)
  }
}