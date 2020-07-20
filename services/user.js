import mongoose from 'mongoose'
import { returnBody } from './common'
import R from 'ramda'

const User = mongoose.model('User')

export const findAndCreatUser = async (openid) => {
    let user = await User.findOne({
        openid
    },
    {
        is_del: 0,
        inviter: 0
    }).exec()

    if (!user) {
        user = await _addNewUser(openid)
    }

    return user
}

const _addNewUser = async openid => { // 添加用户和绑定表
    const newUser = new User({
        openid
    })

    return new Promise((resolve, reject) => {
        newUser.save((err, doc) => {
            if (err) {
                resolve(false)
            } else {
                resolve(doc)
            }
        })
    })
}


export const saveUserInfo = async (req) => {
    const success = await User.updateOne({
        openid: req.header.authorization
    }, {
        avatar_url: req.body.avatarUrl,
        city: req.body.city,
        country: req.body.country,
        gender: req.body.gender,
        nick_name: req.body.nickName,
        province: req.body.province
    }).exec()

    if (success.ok) {
        return returnBody(200, success, '更新成功')
    } else {
        return returnBody(500, success, '保存失败')
    }
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