import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CommentSchema = new Schema({
    commentdetail: {
        type: String,
        required: true
    },
    imgs: Array,
    commentid: String, // 评论别人的评论，评论ID 评论别人的评论时才有
    isdelete: {
        type: Boolean,
        default: false
    },
    companyid: {
        type: String,
        required: true
    }, // 评论的主体
    userid: {
        type: String,
        required: true
    }, // 评论人
    linkid: String, // @的人的ID
    linkname: String, // @的人的用户名
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

CommentSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})


mongoose.model('Comment', CommentSchema)