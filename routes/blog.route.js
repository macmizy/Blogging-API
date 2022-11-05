const express = require('express')
const blogModel = require('../models/blog.model')
const userModel = require('../models/user.model')
const passport = require('passport')

const blogRoute = express.Router()

blogRoute.get('/',async(req,res)=>{
    try{
        const {page, orderby,search} = req.query
        const limit = 20
        const skip = (page-1) * limit

        if(orderby == 'timestamp'){
            const blog = await blogModel.find({state: 'published'}).limit(limit).skip(skip).sort({createdAt: 1})
            return res.status(200).send(blog)
        }
        if(orderby == 'reading_time'){
            const blog = await blogModel.find({state: 'published'}).limit(limit).skip(skip).sort({reading_time: 1})
            return res.status(200).send(blog)
        }
        if(orderby == 'read_count'){
            const blog = await blogModel.find({state: 'published'}).limit(limit).skip(skip).sort({read_count: 1})
            return res.status(200).send(blog)
        }
        if(search){

            const blog = await blogModel.find({state: 'published'}).and({
            $or: [
              {
                title: { $regex: search, $options: "i" },
              },
              {
                author: { $regex: search, $options: "i" },
              },
              {
                tags: { $regex: search, $options: "i" },
              }
            ],
            }).limit(limit).skip(skip)
            return res.status(200).send(blog)
        }
        const blog = await blogModel.find({state: 'published'}).limit(limit).skip(skip)
        return res.status(200).send(blog)
        

    }catch(err){
        console.log(err)
        return res.send(err)
    }
})


// GET SINGLE BLOG BY ID 
blogRoute.get('/:blogId', async (req,res)=>{
    try{
        const blogId = req.params.blogId
        const blog = await blogModel.findById({_id: blogId})
        blog.read_count++
        await blog.save()
         const userId = blog.userId
         const user = await userModel.findById(userId)
        return res.send({blog: blog, user: user})


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
        return res.status(200).send(updateState)  
    }catch(err){
        console.log(err)
        return res.send(err)
    }
})

blogRoute.delete('/deleteblog/:id', async (req,res)=>{
    try{
        const Id  = req.params.id
        const blog = await blogModel.deleteOne({ _id: Id})
        return res.json({ status: true, ...blog })

    }catch(err){
        console.log(err)
        return res.send(err)
    }
    
})

module.exports = blogRoute