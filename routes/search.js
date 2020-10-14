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
  examDelet,
  examStuDetail
} from '../services/searchService'

@Controller('/search')
export default class SearchPage {
  @Get('/student')
  @Auth(1)
  async searchFromKey (ctx, next) {
    // 家长查询学生
    ctx.type = 'text/json; charset=utf-8'
    ctx.body = await findStudent(ctx.query, ctx.request.body.userinfo)
    await next()
  }

  @Get('/teacherStudent')
  @Auth(2)
  async findTeacherStudent (ctx, next) {
    // 获取学生教师对应表
    ctx.body = await getTeacherStudentList(ctx)
  }

  @Get('/examInfo')
  @Auth(2)
  async findExamList (ctx, next) {
    // 获取试卷列表信息
    ctx.body = await getExamInfo(ctx)
  }

  @Put('/setHidden')
  @Auth(2)
  async setExamHidden (ctx, next) {
    // 设置试卷隐藏状态
    ctx.body = await examHidden(ctx)
  }

  @Delete('/deletExam/:id')
  @Auth(2)
  async toDeletExam (ctx, next) {
    // 删除试卷
    ctx.body = await examDelet(ctx)
  }

  @Get('/stuInfo')
  @Auth(2)
  async findStudentInfo (ctx, next) {
    // 教师获取学生的详情
    ctx.body = await getStuInfo(ctx)
  }

  @Get('/techerExamDetail')
  @Auth(2)
  async getExamStuDetail (ctx, next) {
    // 获取老师对应试卷的详细信息（学成成绩列表）
    ctx.body = await examStuDetail(ctx)
  }
}