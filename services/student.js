import mongoose from 'mongoose'
import { returnBody } from './common'
import R from 'ramda'

const Student = mongoose.model('Student')
const TeacherStudent = mongoose.model('TeacherStudent')
const ExamList = mongoose.model('ExamList')

export const uploadList = async (list, openid) => {
    if (R.isEmpty(list)) {
        return returnBody(400, '', '没有数据')
    }
    const user = await ExamList.count({
        exam_mark: list[0].mark,
        openid: list[0].openid,
        is_del: false
    }).exec()
    if (user) {
        return returnBody(400, '', '该备注已经存在了')
    }
    await _saveExamInfo(list[0].mark, list.length, openid)
    let status = true
    for (let i = 0; i < list.length; i++) {
        const element = list[i]
        // 保存到考试列表
        const x = await _saveOneStudent(element, openid)
        // 抽离学生出来，姓名和ID作为唯一性
        const y = await _saveTeacherStudent(element, openid)
        if (!x || !y) status = false
    }

    return returnBody(status ? '200' : '500',
    '',
    status ? '保存成功' : '保存失败')
}

const _saveOneStudent = async (item, openid) => {
    // 单个保存学生数据
    let newStudent = new Student({
        student_name: item.student_name,
        student_id: item.student_id,
        mark: item.mark,
        create_user: item.create_user,
        openid,
        keywords: item.keywords,
        detail: item.detail,
        meta: item.meta
    })
    return await new Promise((resolve, reject) => {
        newStudent.save(err => {
            if (err) {
                reject(false)
            } else {
                resolve(true)
            }
        })
    })
}

const _saveTeacherStudent = async (listItem, openid) => {
    // 保存学生到教师学生对应表
    const obj = {
        student_name: listItem.student_name,
        student_id: listItem.student_id,
        teacher_openid: openid
    }
    const teacherStudent = await TeacherStudent.find(obj)
    if (teacherStudent.length) return true
    // 没有找到当前学生
    const news = new TeacherStudent(obj)
    return await new Promise((resolve, reject) => {
        news.save(err => {
            if (err) {
                reject(false)
            } else {
                resolve(true)
            }
        })
    })
}

const _saveExamInfo = async (mark, count, openid) => {
    // 更新教师相关的试卷信息
    const news = new ExamList({
        openid,
        exam_mark: mark,
        create_date: new Date(),
        student_count: count
    })
    news.save(err => {
        if (err) {
            console.log(err, '新建出错')
        }
    })
}

// export const getStudent = async (keyword) => {
//     const studentList = await Student.find({studentname:keyword}).sort({'meta.updateAt': -1}).exec()

//     if (studentList) {
//         return (returnBody(200, studentList, '获取成功'))
//     } else {
//         return (returnBody(200, [], '没有找到相关数据'))
//     }
// }


// export const getMark = async (hotkey, page) => {
//     page = page ? page : 1
//     const allConut = await Student.count({
//         $or: [
//             {
//                 mark: {$regex: hotkey || ''},
//             },
//         ]
//     }).exec()

//     if (!allConut) {
//         return (returnBody(200, {
//             pageTotle: 0,
//             page,
//             studentList: []
//         }, '获取成功'))
//     }

//     const studentList = await Student.find(
//         {
//             $or: [
//                 {
//                     mark: {$regex: hotkey || ''},
//                 }
//             ],
//         }
//     )
//     .limit(1000)
//     .skip((page - 1) * 1000)
//     .sort({'meta.updateAt': -1})
//     .exec()

//     return returnBody(200, {
//         pageTotle: Math.ceil(allConut / 1000),
//         page,
//         studentList
//     }, '查询成功')
// }


// export const deletMark = async mark => {
//     return new Promise((resolve) => {
//         Student.deleteMany({mark: mark}, err => {
//             if (err) {
//                 resolve(returnBody(400, err))
//             } else {
//                 resolve (returnBody(200, '', '删除数据成功'))
//             }
//         })
//     })
// }
