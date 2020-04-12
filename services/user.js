import mongoose from 'mongoose'

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
        return {
            success: false,
            resMsg: '该用户已存在',
            data: ''
        }
    }
    const news = new User({
        username,
        password,
        role
    })

    return await new Promise((resolve, reject) => {
        news.save(err => {
            if (err) resolve({
                success: false,
                data: err
            })
            resolve ({
                success: true,
                resMsg: '用户添加成功',
                data: ''
            })
        })
    })
}

export const checkAuth = async (id) => {
    const user = await User.findOne({_id: id},{password: 0}).exec()
    if (user) return user
    return false
}