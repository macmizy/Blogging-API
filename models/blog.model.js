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
        type: Number
    },
    reading_time:{
        type: Number
    },
    
},{timestamps: true}
)

const blogModel = mongoose.model('blogs',blogSchema)
module.exports = blogModel