import cors from 'koa2-cors'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import json from 'koa-json'
import koaStatic from 'koa-static'
import { join } from 'path'

export const addStatic = app => {
  app.use(koaStatic(join(__dirname, '../public')))
}

export const addCors = app => {
  app.use(cors())
}

export const addBodyParser = app => {
  app.use(bodyParser())
}

export const addLogger = app => {
  app.use(logger())
}

export const addJson = app => {
  app.use(json())
}