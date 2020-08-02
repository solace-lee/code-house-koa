import mongoose from 'mongoose'
// 关联表

const Schema = mongoose.Schema

const TeacherStudentSchema = new Schema({
    teacher_openid: { // 教师OpenID
        type: String,
        required: true
    },
    bind_openid: { // 绑定的家长ID
        type: Array,
        default: []
    },
    black_list: { // 家长的黑名单列表,openid
        type: Array,
        default: []
    },
    student_name: {
        type: String,
        required: true,
    },
    student_id: {
        type: String,
        default: ''
    },
    is_del: {
        type: Boolean,
        default: false
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

TeacherStudentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})


mongoose.model('TeacherStudent', TeacherStudentSchema)