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
    create_date: {
        type: String,
        default: '1590084000000'
    }
})

TeacherInvitationSchema.pre('save', function (next) {
    this.create_date = new Date().getTime().toString()
    next()
})

mongoose.model('TeacherInvitation', TeacherInvitationSchema)
