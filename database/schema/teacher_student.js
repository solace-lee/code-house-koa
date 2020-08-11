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
    create_date: {
        type: String,
        default: '1590084000000'
    }
})

TeacherStudentSchema.pre('save', function (next) {
    this.create_date = new Date().getTime().toString()
    next()
})

mongoose.model('TeacherStudent', TeacherStudentSchema)