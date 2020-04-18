import cors from 'koa2-cors'
import koaBody from 'koa-body'
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

export const addKoaBody = app => {
  app.use(koaBody({
    multipart: true,
    formidable: {
      maxFieldsSize: 2000*1024*1024
    }
  }))
}

export const addLogger = app => {
  app.use(logger())
}

export const addJson = app => {
  app.use(json())
}