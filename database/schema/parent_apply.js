import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ParentApplySchema = new Schema({
    openid: { // 家长的openID
        type: String,
        required: true
    },
    studentname: {
        type: String,
        required: true,
    },
    studentid: {
        type: String,
        required: true,
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


ParentApplySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('ParentApply', ParentApplySchema)
