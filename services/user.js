import mongoose from 'mongoose'
import { returnBody } from './common'

const User = mongoose.model('User')

export const checkPassword = async (username, password) => {
    let match = false
    const user = await User.findOne({username:username}).exec()

    if (user) {
        match = await user.comparePassword(password, user.password)
    }

    return {
        match,
        user
    }
}

export const addNewUser = async (username, password, role) => {
    const user = await User.findOne({username}).exec()
    if (user) {
        return returnBody(400, '', '该用户已存在')
    }
    const news = new User({
        username,
        password,
        role
    })

    return await new Promise((resolve, reject) => {
        news.save(err => {
            if (err) resolve(returnBody(400, err))
            resolve (returnBody(200, '', '用户添加成功'))
        })
    })
}

export const checkAuth = async (id) => {
    const user = await User.findOne({_id: id},{password: 0}).exec()
    if (user) return user
    return false
}