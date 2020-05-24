import mongoose from 'mongoose'

const Schema = mongoose.Schema

const StudentSchema = new Schema({
    studentname: {
        type: String,
        required: true,
    },
    studentid: {
        type: String,
        required: true,
    },
    mark: {
        type: String,
        required: true
    },
    createuser: {
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
    meta: {
        updateAt: {
            type: String,
            default: '1590084000000'
        }
    }
})


mongoose.model('Student', StudentSchema)
