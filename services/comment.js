import mongoose from 'mongoose'
import { returnBody } from './common'
import R from 'ramda'

const Comment = mongoose.model('Comment')

export const checkEvery = async body => {
    let x = true
    if (body.commentdetail.length < 4) x = false
    if (!R.equals(body.companyid.length, 24)) x = false
    return x
}

export const saveComment = async (body, authId) => {
    const news = new Comment({
        commentdetail: body.commentdetail,
        imgs: body.imgs || [],
        commentid: body.commentid || '',
        companyid: body.companyid,
        userid: authId,
        linkid: body.linkid || '',
        linkname: body.linkname || ''
    })

    return await new Promise((resolve, reject) => {
        news.save(err => {
            if (err) resolve(returnBody(400, err))
            resolve (returnBody(200, '', '添加成功'))
        })
    })
}