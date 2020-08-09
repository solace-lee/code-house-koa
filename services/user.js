import mongoose from 'mongoose'
import { returnBody } from './common'
import R from 'ramda'

const User = mongoose.model('User')
const TeacherStudent = mongoose.model('TeacherStudent')
const TeacherInvitation = mongoose.model('TeacherInvitation')

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
    if (!(/^[A-Za-z0-9]+$/.test(newPassword)) && newPassword.length < 3 && newPassword.length > 16) {
        return returnBody(500, '', '密码不符合规则')
    }
    const hasOne = await User.findOne({
        username: newUserName,
        openid: {
            $ne: openid
        }
    })
    if (hasOne) {
        return returnBody(201, '', '已存在重复的用户名或密码，请更换后重试')
    }
    await User.updateOne({
        openid
    },{
        username: newUserName,
        password: newPassword
    }).exec()
    return returnBody(200, '', '成功')
}


export const getPwStatus = async (ctx) => {
    // 查询是否设置了密码
    const openid = ctx.request.header.authorization
    let user = await User.findOne({
        openid
    }).exec()
    if (user) {
        user.password = user.password ? user.password.length : 0
        return returnBody(200, user, '成功')
    } else {
        return returnBody(500, '', '访问失败')
    }
}

export const inviteStatus = async (ctx) => {
    // 查询用户的邀请码状态
    const openid = ctx.request.header.authorization
    const x = await TeacherInvitation.findOne({
        openid,
        is_del: false
    })
    if (x) {
        return returnBody(200, x, '成功')
    } else {
        return returnBody(200, {}, '成功')
    }
}

export const createInvite = async (ctx) => {
    const openid = ctx.request.header.authorization
    const x = await TeacherInvitation.count({
        openid,
        // is_del: true // 目前限制一个用户只允许生成一个邀请码
    })
    if (x) {
        return returnBody(500, '', '邀请人数已达上限，无法生成')
    } else {
        const code = _makeABC(6)
        const news = new TeacherInvitation ({
            openid,
            invite_code: code
        })
        await news.save(err => {
            if (err) {
                console.log('保存邀请码出错')
            }
        })
        return returnBody(200, '', '生成邀请码成功')
    }
}

const _makeABC = (count) =>{
    const make = () => {
        const a = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        let x = Math.random() * 26
        x = Math.floor(x)
        return a[x]
    }
    let str = ''
    for (let i = 0; i < count; i++) {
        str = `${str}${make()}`
    }
    return str
}

export const confirmInviteCode = async (ctx) => {
    // 确认教师邀请
    const openid = ctx.request.header.authorization
    const code = ctx.request.body.code
    const x = await TeacherInvitation.count({
        invite_code: code,
        is_del: false
    }).exec()
    if (x) {
        const y = await new Promise((resolve) => {
            TeacherInvitation.findOneAndUpdate({
                invite_code: code,
                is_del: false
            }, {
                is_del: true
            }, (err, res) => {
                if (err) {
                    console.log('使用邀请码出错')
                    resolve(false)
                } else {
                    resolve(res)
                }
            })
        })
        if (y) {
            return await new Promise((resolve) => {
                User.updateOne({
                    role: 1,
                    openid: openid
                },{
                    role: 2,
                    inviter: y.openid
                },(err) => {
                    if (err) {
                        console.log('更新用户权限出错')
                        resolve(returnBody(500, '', '更新用户权限出错'))
                    } else {
                        resolve(returnBody(200, '', '成功邀请'))
                    }
                })
            })
        } else {
            returnBody(500, '', '使用邀请码出错')
        }
    } else {
        return returnBody(500, '', '不合法的邀请码')
    }
}






const _changeRole = async (id, newRole) => {
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

