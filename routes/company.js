import {
    Controller,
    Required,
    Post,
    Auth,
    Put,
    Get,
    Log
} from '../decorator/router'

import { checkEvery, saveCompany, companyVerify } from '../services/company'

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
            ctx.body = {
                success: false,
                errCode: 500,
                errMsg: '输入的内容长度不符合要求'
            }
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

    @Put('/admindelete')
    @Auth(2)
    @Required({
        body: ["companyid"]
    })
    async realDelet (ctx, next) {

    }

}