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
} from '../services/comment'
import { returnBody } from '../services/common'


@Controller('/comment')
export default class CompanyRouter{ // 添加公司
    @Post('/add')
    @Auth(1)
    @Required({
        body: ['commentdetail', 'companyid']
    })
    async addComment (ctx, next) {
        if (checkEvery(ctx.request.body)) {
            // 校验各个参数是否符合规范
            ctx.body = await saveCompany(ctx.request.body, ctx.request.header.authorization)
        } else {
            ctx.body = returnBody(400, '', '输入的内容长度不符合要求')
        }
        await next()
    }

}