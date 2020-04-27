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
    // 获取用户
    const user = await User.findOne({_id: id},{password: 0}).exec()
    if (user) return user
    return false
}

export const getAllUsers = async (hotkey, page) => {
    page = page ? page : 1
    const allConut = await User.count({
        $or: [
            {
                username: {$regex: hotkey || ''},
            },
        ]
    }).exec()

    const users = await User.find(
        {
            $or: [
                {
                    username: {$regex: hotkey || ''},
                }
            ],
        },
        {
            password: 0,
            hashed_password: 0
        }
    )
    .limit(10)
    .skip((page - 1) * 10)
    .sort({'meta.updateAt': -1})
    .exec()

    return returnBody(200, {
        pageTotle: Math.ceil(allConut / 10),
        page,
        users
    }, '查询成功')
}

export const changeRole = async (id, newRole) => {
    return new Promise((resolve) => {
        User.update(
            { _id: id },
            {
                role: newRole
            },
            err => {
                if (err) {
                    resolve(returnBody(400, err))
                } else {
                    resolve (returnBody(200, '', '修改成功'))
                }
            }
        )
    })
}

export const delUser = async id => {
    return new Promise((resolve) => {
        User.remove({_id: id}, err => {
            if (err) {
                resolve(returnBody(400, err))
            } else {
                resolve (returnBody(200, '', '删除用户成功'))
            }
        })
    })
}

export const getUserInfo = async (id) => {
    // 获取用户信息
    const user = await User.findOne({_id: id},{
        role: 1,
        username: 1,
        headimg: 1
    }).exec()
    if (user) return user
    return {}
}