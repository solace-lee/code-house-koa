import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TeacherInvitationSchema = new Schema({
    openid: {
        type: String,
        required: true
    },
    invite_code: {
        type: String,
        required: true
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


TeacherInvitationSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('TeacherInvitation', TeacherInvitationSchema)
