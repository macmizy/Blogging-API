const blogModel = require('../models/blog.model')
const userModel = require('../models/user.model')
const passport = require('passport')

async function getBlog(req,res,next){
    try{
        const {page, sortBy,search,orderBy = 'asc'} = req.query
        orderBy === "desc"? orderIndex = -1 : orderIndex = 1
        const limit = 20
        const skip = (page-1) * limit

        if(sortBy == 'timestamp'){
            const blog = await blogModel.find({state: 'published'}).limit(limit).skip(skip).sort({createdAt: orderIndex})
            return res.status(200).send(blog)
        }
        if(sortBy == 'reading_time'){
            const blog = await blogModel.find({state: 'published'}).limit(limit).skip(skip).sort({reading_time: orderIndex})
            return res.status(200).send(blog)
        }
        if(sortBy == 'read_count'){
            const blog = await blogModel.find({state: 'published'}).limit(limit).skip(skip).sort({read_count: orderIndex})
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
        return res.status(400).send({
            status: "false",
            message: "unable to get blogs"
        })
    }
}

async function getSingleBlog(req,res,next){
    try{
        const blogId = req.params.blogid
        const blog = await blogModel.findById(blogId)

        if(!blog){
                return res.status(404).json({message: "Blog Not Found"})
        }if (blog.state != 'published') {
            return res.status(403).json({
                status: false,
                error: 'Requested article is not published'
            })
        }

        blog.read_count++
        await blog.save()
        const userId = blog.userId
         const user = await userModel.findById(userId)
        return res.send({blog: blog, user: user})


    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: "false",
            message: "unable to get blog"
        })
    }
}

async function createBlog(req,res,next){
    try{
        const body = req.body
        const userId = req.params.userid
        function readings(){
            let wpm = 200
            let wordcount = body.body.split(" ").length
            const division = wordcount / wpm
            if(division <= 1){
                const newtime = division * 60
                const times = Math.round(newtime)
                let readingTime = `${times} seconds`
                return readingTime
            }
            let time = Math.round(division)
            let readingTime = `${time} minutes`
            return readingTime
        }
        const newBody= {...body,userId:userId,reading_time: readings(),}
        const blog = await blogModel.create(newBody)
        if(!blog){
            return res.status(404).json({ status: false, blog: null })
        }

        const user = await userModel.findByIdAndUpdate(userId, {$push:{blogsId: blog._id}},{new: true})
        user.save()
        
        res.status(200).send(blog)

    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: "false",
            message: "unable to create blog"
        })
    }

}

async function getOwnerBlogs(req,res,next){
    try{
        const {page, state} = req.query
        const userId = req.params.userid
        const limit = 2
        const skip = (page-1) * limit

        if(state == "draft"){
            const blogs = await blogModel.find({userId: userId, state: 'draft'}).limit(limit).skip(skip)
            return res.status(200).json(blogs)
        }
        if(state == "published"){
            const blogs = await blogModel.find({userId: userId, state: 'published'}).limit(limit).skip(skip)
            return res.status(200).json(blogs)
        }
        const blogs = await blogModel.find({userId: userId}).limit(limit).skip(skip)
        res.status(200).json(blogs)

    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: "false",
            message: "unable to get user blogs"
        })
    }
}

async function updateBlogState(req,res,next){
    try{
        const state  = req.body.state
        const blogId = req.params.blogid
        const user = await userModel.find({blogsId: {$in: blogId}})
        if(user){
            const updateState = await blogModel.findByIdAndUpdate({_id: blogId},{state: state},{new: true})
            return res.status(200).send(updateState)
        }
          
    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: "false",
            message: "Unable to update blog state"
        })
    }
}

async function updateBlogPost(req,res,next){
    try{
        const body  = req.body
        const blogId = req.params.blogid
        const user = await userModel.find({blogsId: {$in: blogId}})
        if(user){
            const updateBlog = await blogModel.findByIdAndUpdate({_id: blogId},{...body},{new: true})
            return res.status(200).send(updateBlog)
        }
          
    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: "false",
            message: "unable to update blog post"
        })
    }
}

async function deleteBlogPost(req,res,next){
    try{
        const blogId  = req.params.blogid
        const user = await userModel.find({blogsId: {$in: blogId}})
        if(user){
            const blog = await blogModel.deleteOne({ _id: blogId})
            return res.json({ status: true, ...blog })
        }
        

    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: "false",
            message: "unable to delete post"
        })
    }
    
}




module.exports ={
    getBlog,
    getSingleBlog,
    createBlog,
    getOwnerBlogs,
    updateBlogState,
    updateBlogPost,
    deleteBlogPost
}