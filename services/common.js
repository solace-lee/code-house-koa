import fs from 'fs'
import { join } from 'path'
import R from 'ramda'
import config from '../config'

// import mongoose from 'mongoose'
// const Image = mongoose.model('Image')


export const returnBody = (code, data, msg) => {
  return {
    code,
    data: data || '',
    msg: msg || ''
  }
}

export const uploadImg = async file => {
  // 创建可读流
  if (R.includes('image/', file.type)) {
    const reader = fs.createReadStream(file.path)
    const fileName = parseInt(Date.now() * 1000) + parseInt(Math.random() * 1000)
    const fileType = file.name.match(/\.\w+$/)[0]
    let filePath = join(__dirname, '../public/upload/images') + `/${fileName}${fileType}`
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    // const news = new Image({
    //   imagePath: `${fileName}${fileType}`
    // })
    // return await new Promise((resolve, reject) => {
    //     news.save(err => {
    //         if (err) {
    //           resolve(
    //             returnBody(400, '', '上传失败')
    //           )
    //         } else {
    //           resolve (returnBody(200, {
    //             path: `${fileName}${fileType}`,
    //             prefix: config.prefix
    //           }, '上传成功'))
    //         }
    //     })
    // })
  } else {
    return returnBody(400, '', '文件类型不正确')
  }
}