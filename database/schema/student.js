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

StudentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})


mongoose.model('Student', StudentSchema)
