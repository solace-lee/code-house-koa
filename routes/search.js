import {
    Controller,
    Post,
    Get,
    Log
} from '../decorator/router'

@Controller('/search')
export default class SearchPage {
  @Get('/companylist')
  @Log
  async searchFromKey (ctx, next) {
    const x = ctx.query.key
    let data = []
    if (x) {
      data = [
        {
          companyName: '聚韬信息科技有限公司',
          city: '广州'
        },
        {
          companyName: '安捷伦贸易有限公司',
          city: '广州'
        },
        {
          companyName: '联想阳光雨露有限公司',
          city: '上海'
        },
        {
          companyName: '达能食品饮料有限公司',
          city: '广州'
        },
        {
          companyName: '广东银保监局',
          city: '广州'
        },
        {
          companyName: '旭伟科技有限公司',
          city: '东莞'
        }
      ]
    } else {
      ctx.res.writeHead(500)
      data = []
    }
    ctx.type = 'text/json; charset=utf-8'
    ctx.body = {
      status: 0,
      resMsg: '成功',
      data
    }
    next()
  }

}