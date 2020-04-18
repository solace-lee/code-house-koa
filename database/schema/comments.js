import { Schema } from 'mongoose'

// const Schema = mongoose.Schema

const CommentSchema = new Schema({
    commentDetail: {
        type: String,
        required: true
    },
    imgs: Array,
    isDelete: {
        type: Boolean,
        default: false
    },

})