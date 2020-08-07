import mongoose from 'mongoose'
import { returnBody } from './common'
import R from 'ramda'

const User = mongoose.model('User')
const TeacherStudent = mongoose.model('TeacherStudent')

export const findAndCreatUser = async (openid) => {
    // 搜索现有用户并返回用户信息，或根据openID创建一个新用户并返回用户信息
    let user = await User.findOne({
        openid,
        is_del: false
    },
    {
        is_del: 0,
        inviter: 0,
        password: 0
    }).exec()

    if (!user) {
        user = await _addNewUser(openid)
    }

    if (user.bind_list.length) {
        let hasChange = false
        let newList = []
        for (let i = 0; i < user.bind_list.length; i++) {
            const element = user.bind_list[i]
            const a = await TeacherStudent.count({
                _id: element,
                is_del: false
            }).exec()
            if (a) {
                newList.push(element)
            } else {
                hasChange = true
            }
            
        }

        user.bind_list = newList
        if (hasChange) {
            await user.save(err => {
                if (err) {
                    console.log(err, '更新绑定列表失败')
                }
            })
        }
        user.bind_list = await Promise.all(user.bind_list.map(async val => {
            return await TeacherStudent.findOne({
                _id: val,
                is_del: false
            }).exec()
        }))
    }

    return user
}

const _addNewUser = async openid => {
    // 添加用户和绑定表
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
    // 更新用户信息
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

export const getUserInfo = async (req) => {
    // 根据用户名和密码获取用户信息
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    },{
        password: 0,
    }).exec()
    if (user) return returnBody(200, user, '成功')
    return returnBody(500, {}, '没有找到相关用户')
}


export const savePassword = async (req) => {
    const openid = req.header.authorization
    const newUserName = req.body.username
    const newPassword = req.body.password
    await User.updateOne({
        openid
    },{
        username: newUserName,
        password: newPassword
    }).exec()
    return returnBody(200, user, '成功')
}


export const getPwStatus = async (ctx) => {
    // 查询是否设置了密码
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

