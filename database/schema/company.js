import mongoose from 'mongoose'

const Schema = mongoose.Schema

const CompanySchema = new Schema({
    companyname: {
        type: String,
        required: true,
        unique: true
    },
    address: String,
    userid: String,
    province: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    companydetail: {
        type: String,
        required: true
    },
    imgs: Array,
    isverify: {
        type: Boolean,
        default: false
    },
    isdelete: {
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

CompanySchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})


mongoose.model('Company', CompanySchema)