import {
    Controller,
    Required,
    Post,
    Auth,
    Put,
    Delete,
    Get,
    Log
} from '../decorator/router'

import {
    checkEvery,
    saveCompany,
    companyVerify,
    companyDelete,
    getDetail
} from '../services/company'
import { returnBody } from '../services/common'


@Controller('/company')
export default class CompanyRouter{ // 添加公司
    @Post('/add')
    @Auth(1)
    @Required({
        body: ['companyname', 'province', 'city', 'companydetail']
    })
    @Log
    async addCompany (ctx, next) {
        if (checkEvery(ctx.request.body)) {
            // 校验各个参数是否符合规范
            ctx.body = await saveCompany(ctx.request.body, ctx.request.header.authorization)
        } else {
            ctx.body = returnBody(400, '', '输入的内容长度不符合要求')
        }
        await next()
    }

    @Put('/verify')
    @Auth(2)
    @Required({
        body: ['status', "companyid"]
    })
    async changeCompanyVerify (ctx, next) {
        ctx.body = await companyVerify(ctx.request.body)
        await next()
    }

    @Delete('/admindelete')
    @Auth(2)
    async realDelet (ctx, next) {
        if (ctx.query.companyid && (ctx.query.companyid.length === 24)) {
            return ctx.body = await companyDelete(ctx.query.companyid)
        } else return ctx.body = returnBody(400, '', '公司ID错误')
    }

    @Get('/companyDetail')
    // @Auth(1)
    async getCompanyDetail (ctx, next) {
        if (ctx.query.companyid && (ctx.query.companyid.length === 24)) {
            return ctx.body = await getDetail(ctx.query.companyid)
        } else return ctx.body = returnBody(400, '', '公司ID错误')
        await next()
    }

}