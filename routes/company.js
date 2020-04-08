import {
    Controller,
    Required,
    Post,
    Get,
    Log
} from '../decorator/router'

import { checkEvery } from '../services/company'

@Controller('/company')
export default class CompanyRouter{
    @Post('/add')
    @Required({
        body: ['companyname', 'province', 'city', 'companydetail']
    })
    @Log
    async addCompany (ctx, next) {
        if (checkEvery(ctx.request.body)) {
            // 校验各个参数是否符合规范
        }
    }
}