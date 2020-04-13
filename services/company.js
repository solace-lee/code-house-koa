import mongoose from 'mongoose'
import { returnBody } from './common'

const Company = mongoose.model('Company')

export const checkEvery = async body => {
    let x = true
    if (body.companyname.length < 4) x = false
    if (body.province.length < 2 || body.province.length > 12) x = false
    if (body.city.length < 2 || body.city.length > 12) x = false
    if (body.companydetail.length < 4 || body.companydetail.length > 4000) x = false
    return x
}

export const saveCompany = async (body, userid) => {
    const { companyname, address, province, city, companydetail, imgs } = body
    const news = new Company({
        companyname,
        userid,
        address,
        province,
        city,
        companydetail,
        imgs
    })

    return await new Promise((resolve, reject) => {
        news.save(err => {
            if (err) resolve(returnBody(400, err))
            resolve (returnBody(200, '', '添加成功'))
        })
    })
}


export const companyVerify = body => {
    const { status, companyid } = body

    return new Promise((resolve) => {
        Company.update(
            {_id: companyid},
            {
                isverify: status
            },
            err => {
                if (err) resolve(returnBody(400, err))
                resolve (returnBody(200, '', '修改成功'))
        })
    })
}