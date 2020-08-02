import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ParentApplySchema = new Schema({
    parent_openid: { // 家长的openID
        type: String,
        required: true
    },
    teacher_student_id: {
        type: String,
        required: true,
    },
    teacher_openid: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        default: ''
    },
    is_del: {
        type: Boolean,
        default: false
    },
    create_date: {
        type: Date
    },
})


ParentApplySchema.pre('save', function (next) {
    this.create_date = Date.now()
    next()
})

mongoose.model('ParentApply', ParentApplySchema)
