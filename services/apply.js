import mongoose from 'mongoose'
import { returnBody } from './common'
import { findAndCreatUser } from './user'

const User = mongoose.model('User')
const TeacherStudent = mongoose.model('TeacherStudent')
const ParentApply = mongoose.model('ParentApply')
const HistoryLog = mongoose.model('HistoryLog')

export const getParentApply = async (ctx) => {
  const openid = ctx.request.header.authorization
  let applyList = await ParentApply.find({
    teacher_openid: openid,
    is_del: false
  }).sort({ create_date: -1 })
    .exec()

  applyList = await Promise.all(applyList.map(async val => {
    let x = val._doc
    x.parentInfo = await findAndCreatUser(val.parent_openid)
    x.bindInfo = await TeacherStudent.findOne({
      _id: val.teacher_student_id
    }).exec()
    return x
  }))

  return returnBody(200, applyList, '成功')
}

export const getCount = async (ctx) => {
  // 查询申请条数
  const openid = ctx.request.header.authorization
  const applyCount = await ParentApply.count({
    teacher_openid: openid,
    is_del: false
  }).exec()
  return returnBody(200, applyCount, '成功')
}

export const addToBlack = async (ctx) => {
  // 把家长加入到某条的黑名单
  const teacherStudentId = ctx.request.body.teacherStudentId
  const parentOpenid = ctx.request.body.parentOpenid
  const applyId = ctx.request.body.applyId || ''

  // 查找该家长
  let parent = await User.findOne({
    openid: parentOpenid,
    is_del: false
  }).exec()

  if (parent) {
    // 移除家长对应的绑定列表，如果有的话
    parent.bind_list = parent.bind_list.filter(val => val !== teacherStudentId)
    parent.save(err => {
      if (err) {
        console.log(err, '保存家长黑名单错误')
      }
    })
  }

  let teacherStu = await TeacherStudent.findOne({
    _id: teacherStudentId,
    is_del: false
  }).exec()

  if (teacherStu) {
    // 标识为已读并添加家长openID到黑名单中
    teacherStu.bind_openid = teacherStu.bind_openid.filter(val => val !== parentOpenid)
    teacherStu.black_list = teacherStu.black_list.filter(val => val !== parentOpenid)
    teacherStu.black_list.push(parentOpenid)
    teacherStu.save(err => {
      if (err) {
        console.log(err, '教师学生映射表添加黑名单失败')
      }
    })
  }

  if (applyId) {
    await applyRead(applyId)
  }

  return returnBody(200, '', '添加黑名单成功')
}

export const applyRead = async (applyId) => {
  // 将申请置为已读
  let applyItem = await ParentApply.findOne({
    _id: applyId,
    is_del: false
  })

  if (applyItem) {
    applyItem.is_del = true
    applyItem.save(err => {
      if (err) {
        console.log(err, '更新申请失败')
      }
    })
  }

  return returnBody(200, '', '忽略成功')

}

export const setApplyPass = async (ctx) => {
  // 通过家长申请
  const teacherStudentId = ctx.request.body.teacherStudentId
  const parentOpenid = ctx.request.body.parentOpenid
  const applyId = ctx.request.body.applyId || ''

  // 查找该家长
  let parent = await User.findOne({
    openid: parentOpenid,
    is_del: false
  }).exec()

  if (parent) {
    // 添加家长对应的绑定
    parent.bind_list = parent.bind_list.filter(val => val !== teacherStudentId)
    parent.bind_list.push(teacherStudentId)
    parent.save(err => {
      if (err) {
        console.log(err, '保存家长绑定列表错误')
      }
    })
  }

  let teacherStu = await TeacherStudent.findOne({
    _id: teacherStudentId,
    is_del: false
  }).exec()

  if (teacherStu) {
    // 标识为已读并添加家长openID到绑定列表中
    teacherStu.bind_openid = teacherStu.bind_openid.filter(val => val !== parentOpenid)
    teacherStu.bind_openid.push(parentOpenid)
    teacherStu.black_list = teacherStu.black_list.filter(val => val !== parentOpenid)
    teacherStu.save(err => {
      if (err) {
        console.log(err, '教师学生映射表添加绑定列表失败')
      }
    })
  }

  if (applyId) {
    await applyRead(applyId)
  }

  return returnBody(200, '', '添加绑定成功')

}

export const checkHistory = async ctx => {
  // 获取用户查询记录
  const historyList = await HistoryLog.find({
    openid: ctx.query.userOpenid
  }).sort({ createAt: -1 })
    .limit(50)

  return returnBody(200, historyList, '成功')
}