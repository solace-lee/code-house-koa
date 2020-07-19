// import mongoose from 'mongoose'
import { returnBody } from './common'

// const Company = mongoose.model('Company')

export const findCompany = async (key) => {
    const companyList = await Company.find(
        {
            isverify: true,
            isdelete: false,
            $or: [
                {
                    companyname: {$regex: key || ''},
                },
                {
                    companydetail: {$regex: key || ''}
                }
            ]
        },
        {
            userid: 0,
            isverify: 0,
            isdelete: 0
        }
    )
    .limit(40)
    .sort({'meta.createAt': -1})
    .exec()
    return returnBody(200, companyList, '查询成功')
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
                companyname: {$regex: hotkey || ''},
            },
            {
                companydetail: {$regex: hotkey || ''}
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
                    companyname: {$regex: hotkey || ''},
                },
                {
                    companydetail: {$regex: hotkey || ''}
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
    .sort({'meta.updateAt': -1})
    .exec()
    return returnBody(200, {
        pageTotle: Math.ceil(allConut / 10),
        page,
        adminlist
    }, '查询成功')
}