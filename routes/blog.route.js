const express = require('express')
const blogModel = require('../models/blog.model')
const passport = require('passport')

const blogRoute = express.Router()

blogRoute.get('/?page',async(req,res)=>{
    try{
        const page = req.query.page
        const limit = 20
        const skip = (page-1) * limit
        const blog = await blogModel.find({state: 'published'}).limit(limit).skip(skip)
        return res.status(200).send(blog)

    }catch(err){
        console.log(err)
        return res.send(err)
    }
})

blogRoute.post('/',async(req,res)=>{
    try{
        const body = req.body
        const blog = await blogModel.create(body)
        return res.status(200).json(blog)

    }catch(err){
        console.log(err)
        return res.send(err)
    }
})

blogRoute.patch('/updateState/:id', async (req,res)=>{
    try{
        const state  = req.body.state
        const Id = req.params.id
        const updateState = await blogModel.findByIdAndUpdate({_id: Id},{state: state},{new: true})
        return res.send(updateState)  
    }catch(err){
        console.log(err)
        return res.send(err)
    }
})

blogRoute.delete('/deleteblog/:id', async (req,res)=>{
    try{
        const Id  = req.params.id
        const blog = await blogModel.deleteOne({ _id: Id})
        return res.json({ status: true, blog })

    }catch(err){
        console.log(err)
        return res.send(err)
    }
    
})

module.exports = blogRoute