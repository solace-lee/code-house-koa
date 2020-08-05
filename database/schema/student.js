import mongoose from 'mongoose'

const Schema = mongoose.Schema

const StudentSchema = new Schema({
    student_name: {
        type: String,
        required: true,
    },
    student_id: {
        type: String,
        required: true
    },
    mark: {
        type: String,
        required: true
    },
    create_user: {
        type: String,
        required: true
    },
    openid: {
        type: String,
        required: true
    },
    keywords: {
        type: Array,
        default: []
    },
    detail: {
        type: Array,
        default: []
    },
    is_hidden: {
        type: Boolean,
        default: false
    },
    is_del: {
        type: Boolean,
        default: false
    },
    meta: {
        updateAt: {
            type: String,
            default: '1590084000000'
        }
    }
})


mongoose.model('Student', StudentSchema)
