import mongoose from 'mongoose'
import { returnBody } from './common'
import R from 'ramda'

const Student = mongoose.model('Student')

export const uploadList = async list => {
    if (R.isEmpty(list)) {
        return returnBody(400, '', '没有数据')
    }
    const user = await Student.findOne({mark: list[0].mark}).exec()
    if (user) {
        return returnBody(400, '', '该备注已经存在了')
    }
    return await new Promise((resolve, reject) => {
        Student.insertMany(list)
            .then((res) => {
                console.log(res)
                resolve (returnBody(200, '', '上传成功'))
            })
            .catch(e => {
                resolve(returnBody(400, e))
            })
    })
}

export const getStudent = async (keyword) => {
    const studentList = await Student.find({studentname:keyword}).sort({'meta.updateAt': -1}).exec()

    if (studentList) {
        return (returnBody(200, studentList, '获取成功'))
    } else {
        return (returnBody(200, [], '没有找到相关数据'))
    }
}


export const getMark = async (hotkey, page) => {
    page = page ? page : 1
    const allConut = await Student.count({
        $or: [
            {
                mark: {$regex: hotkey || ''},
            },
        ]
    }).exec()

    if (!allConut) {
        return (returnBody(200, {
            pageTotle: 0,
            page,
            studentList: []
        }, '获取成功'))
    }

    const studentList = await Student.find(
        {
            $or: [
                {
                    mark: {$regex: hotkey || ''},
                }
            ],
        }
    )
    .limit(1000)
    .skip((page - 1) * 1000)
    .sort({'meta.updateAt': -1})
    .exec()

    return returnBody(200, {
        pageTotle: Math.ceil(allConut / 1000),
        page,
        studentList
    }, '查询成功')
}


export const deletMark = async mark => {
    return new Promise((resolve) => {
        Student.deleteMany({mark: mark}, err => {
            if (err) {
                resolve(returnBody(400, err))
            } else {
                resolve (returnBody(200, '', '删除数据成功'))
            }
        })
    })
}
