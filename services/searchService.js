import mongoose from 'mongoose'
import { returnBody } from './common'

const Student = mongoose.model('Student')
const User = mongoose.model('User')
const TeacherStudent = mongoose.model('TeacherStudent')
const ExamList = mongoose.model('ExamList')
const HistoryLog = mongoose.model('HistoryLog')
const ParentApply = mongoose.model('ParentApply')

export const findStudent = async (query, userInfo) => {
    const openid = userInfo.openid
    const name = query.name
    const id = query.id
    // 保存搜索记录
    _saveHistory(openid, name, id)

    // 家长搜索学生成绩
    // 找出教师学生家长的关联信息来
    let detailList = await Student.find({
        is_del: false,
        student_name: name,
        student_id: id
    })
    .sort({ 'meta.updateAt': -1 })
    .exec()

    if (detailList.length) {
        // 找到了有对应的数据教师
        let teacherStudentList = await TeacherStudent.find({
            student_name: name,
            student_id: id,
            is_del: false
        }).exec()
        // 先找黑名单，排除掉黑名单的数据,生成新的教师学生对应表
        teacherStudentList = teacherStudentList.filter(val => {
            let x = true
            val.black_list.forEach(ele => {
                if (ele === openid) {
                    x = false
                    detailList = detailList.filter(val => {
                        // 过滤掉该老师上传的学生信息
                        return val.openid !== val.teacher_openid
                    })
                }
            })
            return x
        })

        // 找到白名单
        let hasApply = false
        for (let i = 0; i < teacherStudentList.length; i++) {
            const val = teacherStudentList[i];
            let newUser = await User.findOne({openid}).exec()
            // 教师这边的绑定列表
            // 1.绑定列表为空 2.绑定列表有该家长 3.绑定列表有，但是没有该家长
            if (val.bind_openid.length) {
                // 2.绑定列表有该家长不做操作
                const a = val.bind_openid.filter(ele => {
                    return ele === openid
                })
                if (!a.length) {
                    // 3.绑定列表存在但是没有该家长，发出申请，过滤掉
                    detailList = detailList.filter(ele => {
                        return ele.openid !== val.teacher_openid
                    })
                    // 去发申请
                    console.log('发出申请2');
                    hasApply = true
                    await _saveParentsApply(openid, val._id, val.teacher_openid)
                }
            } else {
                // 绑定列表为空，绑定该用户
                if (newUser.bind_list.length) {
                    // 家长的绑定列表已经有数据，但是该老师下的学生还没有被绑定，还是要发起申请
                    // 过滤掉该老师的学生信息，并发起申请
                    detailList = detailList.filter(ele => {
                        return ele.openid !== val.teacher_openid
                    })
                    // 去发申请
                    console.log('发出申请1');
                    hasApply = true
                    await _saveParentsApply(openid, val._id, val.teacher_openid)

                } else {
                    // 家长一个学生都没有绑定，且学生也没被绑定，直接绑定
                    newUser.bind_list.push(val._id)
                    newUser.save(err => {
                        if (err) {
                            console.log(err, '绑定家长出错')
                        }
                    })
                    val.bind_openid.push(openid)
                    val.save(err => {
                        if (err) {
                            console.log(err, '绑定教师学生对应家长出错')
                        }
                    })
                }
            }
        }
        return returnBody(
            hasApply ? 201 : 200,
            detailList,
            hasApply ? `已向老师提交了${name}的查询请求，请稍后再试` : '查找成功'
        )
    } else {
        return returnBody(200, [], '没有找到相关记录')
    }
}

const _saveParentsApply = async (parentOpenid, id, teacherOpenid) => {
    const obj = {
        parent_openid: parentOpenid,
        teacher_student_id: id,
        teacher_openid: teacherOpenid,
        is_del: false
    }
    const x = await ParentApply.findOne(obj).exec()
    if (x) {
        x.create_date = new Date()
        x.save(err => {
            if (err) {
                console.log('更新申请出错', err)
            }
        })
    } else {
        const news = new ParentApply(obj)
        news.save(err => {
            if (err) {
                console.log('保存家长申请出错', err)
            }
        })
    }
}

const _saveHistory = async (openid, name, id) => {
    const news = new HistoryLog({
        openid,
        student_name: name,
        student_id: id
    })
    news.save(err => {
        if (err) {
            console.log('保存搜索记录出错', err)
        }
    })
}


export const getTeacherStudentList = async (ctx) => {
    // 获取教师学生对应列表 ctx.query
    const limit = Number(ctx.query.limit)
    const page = Number(ctx.query.page)
    const sort = ctx.query.sort === '1' ? {student_id: 1} : {student_name: 1}
    const obj = {
        teacher_openid: ctx.request.header.authorization,
        is_del: false,
        $or: [
                {
                    student_name: { $regex: ctx.query.keys || '' },
                },
                {
                    student_id: { $regex: ctx.query.keys || '' },
                }
            ]
    }
    const allCount = await TeacherStudent.count(obj)
    const studentList = await TeacherStudent.find(obj)
        .sort(sort)
        .limit(limit)
        .skip((page - 1) * limit)
        .exec()
    return returnBody(200, {
        studentList,
        allCount,
        page
    }, '查询成功')
}



export const getExamInfo = async (ctx) => {
    // 获取试卷列表 ctx.query
    const limit = Number(ctx.query.limit)
    const page = Number(ctx.query.page)
    const obj = {
        openid: ctx.request.header.authorization,
        is_del: false,
        $or: [
            {
                exam_mark: { $regex: ctx.query.keys || '' },
            }
        ]
    }
    const allCount = await ExamList.count(obj)
    const examList = await ExamList.find(obj)
        .limit(limit)
        .skip((page - 1) * limit)
        .exec()
    return returnBody(200, {
        examList,
        allCount,
        page
    }, '查询成功')
}


export const getStuInfo = async (ctx) => {
    // 获取教师的学生信息 ctx.query
    const name = ctx.query.name
    const openid = ctx.request.header.authorization
    let teacherStudentInfo = await TeacherStudent.find({
        // 查询教师学生关系
        teacher_openid: openid,
        is_del: false,
        student_name: name
    }).exec()
    teacherStudentInfo = await Promise.all(teacherStudentInfo.map(async val => {
        // 查询学生家长绑定关系
        let newLIst = await Promise.all(val.bind_openid.map(async (ele) => {
            return await User.findOne({
                openid: ele,
                is_del: false
            },
            {
                password: 0
            })
        }))

        let blackLIst = await Promise.all(val.black_list.map(async (ele) => {
            return await User.findOne({
                openid: ele,
                is_del: false
            },
            {
                password: 0
            })
        }))

        val.bind_openid = newLIst
        val.black_list = blackLIst
        return val
    }))
    const examInfo = await Student.find({
        // 查询学生试卷信息
        student_name: name,
        is_del: false,
        openid: openid
    }).exec()

    return returnBody(200, {
        teacherStudentInfo,
        examInfo
    }, '查询成功')
}

export const examHidden = async (ctx) => {
    const action = ctx.request.body.hidden
    const openid = ctx.request.header.authorization
    const id = ctx.request.body.id
    let mark = ''
    await ExamList.findByIdAndUpdate({
        _id: id
    },
    {
        is_hidden: action
    }, (err, res) => {
        if (err) {
        console.log(err, '更新试卷隐藏属性出错')
        } else {
            mark = res.exam_mark
        }
    })

    await Student.updateMany({
        mark: mark,
        openid,
        is_del: false
    },
    {
        is_hidden: action
    }).exec()
    return returnBody(200, '', '成功')
}

export const examDelet = async ctx => {
    const openid = ctx.request.header.authorization
    const id = ctx.params.id
    let mark = ''
    await ExamList.findByIdAndUpdate({
        _id: id
    },
    {
        is_del: true
    }, (err, res) => {
        if (err) {
        console.log(err, '更新试卷隐藏属性出错')
        } else {
            mark = res.exam_mark
        }
    })

    await Student.updateMany({
        mark: mark,
        openid,
        is_del: false
    },
    {
        is_del: true
    }).exec()

    return returnBody(200, '', '成功')
}
// export const adminFindCompany = async (body) => {
//     const { page, isverify, isdelete, hotkey, beginTime, endTime } = body
//     const obj = {}
//     if (isverify !== undefined && isverify !== '') obj.isverify = isverify
//     if (isdelete !== undefined && isdelete !== '') obj.isdelete = isdelete

//     const allConut = await Company.count({
//         ...obj,
//         $or: [
//             {
//                 companyname: { $regex: hotkey || '' },
//             },
//             {
//                 companydetail: { $regex: hotkey || '' }
//             }
//         ],
//         'meta.updateAt': {
//             $gt: beginTime || 1,
//             $lt: endTime || Date.now()
//         }
//     }).exec()

//     const adminlist = await Company.find(
//         {
//             ...obj,
//             $or: [
//                 {
//                     companyname: { $regex: hotkey || '' },
//                 },
//                 {
//                     companydetail: { $regex: hotkey || '' }
//                 }
//             ],
//             'meta.updateAt': {
//                 $gt: beginTime || 1,
//                 $lt: endTime || Date.now()
//             }
//         },
//         {
//             companydetail: 0,
//             imgs: 0,
//             userid: 0
//         }
//     )
//         .limit(10)
//         .skip((page - 1) * 10)
//         .sort({ 'meta.updateAt': -1 })
//         .exec()
//     return returnBody(200, {
//         pageTotle: Math.ceil(allConut / 10),
//         page,
//         adminlist
//     }, '查询成功')
// }