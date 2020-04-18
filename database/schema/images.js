import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    imagePath: {
        required: true,
        type: String,
        unique: true
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


ImageSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})

mongoose.model('Image', ImageSchema)
