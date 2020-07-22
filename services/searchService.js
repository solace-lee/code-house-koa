import mongoose from 'mongoose'
import { returnBody } from './common'

const Student = mongoose.model('Student')
const TeacherStudent = mongoose.model('TeacherStudent')

export const findStudent = async (query, userInfo) => {
    // 家长搜索学生成绩
    console.log(userInfo);
    // 找出教师学生家长的关联信息来
    const detailList = await Student.find({
        is_del: false,
        student_name: query.name,
        student_id: query.id
    })
    .sort({ 'meta.updateAt': -1 })
    .exec()

    if (detailList.length) {
        
    }

    const lineList = await TeacherStudent.find({
        is_del: false,
        student_name: query.name
        // student_id: query.id
    })
        // 找出教师学生家长的关联信息来
        .sort({ 'meta.updateAt': -1 })
        .exec()

    if (!lineList.length) {
        return returnBody(201, '', '没有找到相关记录')
    }

    const hasBind = lineList.filter(val => {
        if (val.bind_openid.length) {
            let bindStatus = false
            for (let i = 0; i < val.bind_openid.length; i++) {
                if (userInfo.openid === val.bind_openid[i]) {
                    bindStatus = true
                }
            }
            return bindStatus
        } else {
            return false
        }
    })

    if (hasBind.length) {
        // 存在绑定关系
        
    } else {
        // 家长和学生还没有绑定关系
    }



    if (detailList.length) {
        const bindList = userInfo.bind_list
        if (bindList.length) {
            // 用户存在绑定列表

        }
        return returnBody(200, detailList, '查询成功')
    } else {
        return returnBody(201, '', '没有找到相关记录')
    }


}

export const adminFindCompany = async (body) => {
    const { page, isverify, isdelete, hotkey, beginTime, endTime } = body
    const obj = {}
    if (isverify !== undefined && isverify !== '') obj.isverify = isverify
    if (isdelete !== undefined && isdelete !== '') obj.isdelete = isdelete

    const allConut = await Company.count({
        ...obj,
        $or: [
            {
                companyname: { $regex: hotkey || '' },
            },
            {
                companydetail: { $regex: hotkey || '' }
            }
        ],
        'meta.updateAt': {
            $gt: beginTime || 1,
            $lt: endTime || Date.now()
        }
    }).exec()

    const adminlist = await Company.find(
        {
            ...obj,
            $or: [
                {
                    companyname: { $regex: hotkey || '' },
                },
                {
                    companydetail: { $regex: hotkey || '' }
                }
            ],
            'meta.updateAt': {
                $gt: beginTime || 1,
                $lt: endTime || Date.now()
            }
        },
        {
            companydetail: 0,
            imgs: 0,
            userid: 0
        }
    )
        .limit(10)
        .skip((page - 1) * 10)
        .sort({ 'meta.updateAt': -1 })
        .exec()
    return returnBody(200, {
        pageTotle: Math.ceil(allConut / 10),
        page,
        adminlist
    }, '查询成功')
}