import mongoose from 'mongoose'
// 关联表

const Schema = mongoose.Schema

const ExamlistSchema = new Schema({
    openid: { // 教师OpenID
        type: String,
        required: true
    },
    exam_mark: {
        type: String,
        unique: true,
        required: true
    },
    create_date: {
        type: Date
    },
    is_del: {
        type: Boolean,
        default: false
    },
    student_count: {
        type: Number,
        required: true
    }
})

mongoose.model('ExamList', ExamlistSchema)