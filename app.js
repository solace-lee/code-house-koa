import { join } from 'path'
import Koa from 'koa'
import R from 'ramda'
import config from './config'
import onerror from 'koa-onerror'

const MIDDLEWARES = ['general', 'router']

const useMiddlewares = app => {
  R.map(
    R.compose(
      R.forEachObjIndexed(e => e(app)),
      require,
      name => join(__dirname, `./middleware/${name}`)
    )
  )(MIDDLEWARES)
}


async function start () {
  const app = new Koa()
  const { port } = config
  onerror(app)

  await useMiddlewares(app)

  app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}`)
  })

  const server = app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
  })
}

start()

