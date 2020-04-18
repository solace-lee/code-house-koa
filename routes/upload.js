import {
    Controller,
    Required,
    Post,
    Auth,
    Log
} from '../decorator/router'
import {
  uploadImg
} from '../services/common'


@Controller('/upload')
export default class SearchPage {
  @Post('/img')
  // @Auth(1)
  @Required({
    files: ['file']
  })
  @Log
  async getImgToSave (ctx, next) {
    const file = ctx.request.files.file
    ctx.body = await uploadImg(file)
    await next()
  }
}