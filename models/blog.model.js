const mongoose = require('mongoose')

const Schema = mongoose.Schema

const blogSchema = new Schema({
    title: {
       type: String,
       required: true,
       unique: true
    },
    body: {
        type: String,
        required: true
     },
    description: {
        type: String,
       required: false
    },
    author: {
        type: String,
       required: false
    },
    state: {
        type: String,
        enum: ['draft','published'],
        default: 'draft'
    },
    tags: {
        type: [String]

    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time:{
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
    
},{timestamps: true}
)

const blogModel = mongoose.model('blogs',blogSchema)
module.exports = blogModel