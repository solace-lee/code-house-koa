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
            err: '该用户已存在'
        }
    }
    const news = new User({
        username,
        password,
        role
    })

    await news.save((err, dacs) => {
        if (err) {
            return {
                success: false,
                err: err
            }
        }
        return {
            success: true,
            data: '用户添加成功'
        }
    })
}