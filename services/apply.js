import mongoose from 'mongoose'
import { returnBody } from './common'
import { findAndCreatUser } from './user'

// const User = mongoose.model('User')
const TeacherStudent = mongoose.model('TeacherStudent')
const ParentApply = mongoose.model('ParentApply')

export const getParentApply = async (ctx) => {
  const openid = ctx.request.header.authorization
  let applyList = await ParentApply.find({
    teacher_openid: openid,
    is_del: false
  }).sort({ create_date: -1 })
    .exec()

  applyList = await Promise.all(applyList.map(async val => {
    let x = {
      ...val._doc
    }
    x.parentInfo = await findAndCreatUser(val.parent_openid)
    x.bindInfo = await TeacherStudent.findOne({
      _id: val.teacher_student_id
    }).exec()
    return x
  }))

  return returnBody(200, applyList, '成功')
}