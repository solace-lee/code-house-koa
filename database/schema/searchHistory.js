import mongoose from 'mongoose'
const Schema = mongoose.Schema

const HistorySchema = new Schema({
    openid: {
        type: String,
        required: true,
    },
    student_name: {
        type: String,
        default: ''
    },
    student_id: {
      type: String,
      default: ''
    },
    is_del: {
        type: Boolean,
        default: false
    },
    createAt: {
      type: Date,
      default: Date.now()
    }
})


HistorySchema.pre('save', function (next) {
  this.updateAt = Date.now()
  next()
})

mongoose.model('HistoryLog', HistorySchema)
