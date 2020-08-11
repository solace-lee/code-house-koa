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
        required: true
    },
    is_hidden: {
        type: Boolean,
        default: false
    },
    is_del: {
        type: Boolean,
        default: false
    },
    student_count: {
        type: Number,
        required: true
    },
    create_date: {
        type: String,
        default: '1590084000000'
    }
})

ExamlistSchema.pre('save', function (next) {
    this.create_date = new Date().getTime().toString()
    next()
  })

mongoose.model('ExamList', ExamlistSchema)