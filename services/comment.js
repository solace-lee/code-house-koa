import mongoose from 'mongoose'
import { returnBody } from './common'

const Company = mongoose.model('Comment')

export const checkEvery = async body => {
    let x = true
    if (body.companyname.length < 4) x = false
    if (body.province.length < 2 || body.province.length > 12) x = false
    if (body.city.length < 2 || body.city.length > 12) x = false
    if (body.companydetail.length < 4 || body.companydetail.length > 4000) x = false
    return x
}

