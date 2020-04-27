import mongoose from 'mongoose'
import { returnBody } from './common'
import { getUserInfo } from './user'
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

export const getComment = async (companyid) => {
    // 获取该公司ID下的所有评论
    const all = await Comment.find({
        companyid
    })
    .sort({'meta.createAt': -1})
    .exec()

    if (R.isEmpty(all)) {
        return returnBody(200, '', '查询成功')
    }

    // 处理假删的数据，并关联评论用户的信息,并区分是否是子评论
    let newMain = []
    let newSecond = []
    R.forEach(item => {
        item.userInfo = await getUserInfo(item.userid)
        if (item.isdelete) {
            item.commentdetail = '该评论已被删除'
            item.imgs = []
        }
        if (item.commentid) {
            newSecond.push(item)
        } else {
            newMain.push(item)
        }
    }, all)

    // 塞数据进去主评论
    R.map(val => {
        val.children = []
        R.forEach(ele => {
            if (R.equals(val._id, ele.commentid)) {
                val.children.push(ele)
            }
        }, newSecond)
        return val
    }, newMain)

    return returnBody(200, newMain, '查询成功')

}