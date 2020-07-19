import mongoose from 'mongoose'

const Schema = mongoose.Schema

const TeacherStudentSchema = new Schema({
    openid: { // 教师OpenID
        type: String,
        required: true
    },
    studentname: {
        type: String,
        required: true,
    },
    studentid: {
        type: Array,
        default: []
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