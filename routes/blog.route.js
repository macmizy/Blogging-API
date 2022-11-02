const express = require('express')
const blogModel = require('../models/blog.model')
const passport = require('passport')

const blogRoute = express.Router()

blogRoute.get('/',async(req,res)=>{
    try{
        const blog = await blogModel.find()
        res.status(200).json(blog)

    }catch(err){
        console.log(err)
        res.send(err)
    }
})

blogRoute.post('/',async(req,res)=>{
    try{
        const body = req.body
        const blog = await blogModel.create(body)
        res.status(200).json(blog)

    }catch(err){
        console.log(err)
        res.send(err)
    }
})

module.exports = blogRoute