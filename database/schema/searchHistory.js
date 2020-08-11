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
    create_date: {
      type: String,
      default: '1590084000000'
    }
})


HistorySchema.pre('save', function (next) {
  this.create_date = new Date().getTime().toString()
  next()
})

mongoose.model('HistoryLog', HistorySchema)
