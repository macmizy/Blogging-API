const express = require('express')
const blogModel = require('../models/blog.model')
const userModel = require('../models/user.model')
const passport = require('passport')
const blogcontrol = require('../controllers/blog.controller')

const blogRoute = express.Router()



// GET A LIST OF BLOG LOGGED IN OR NOT LOGGED IN

blogRoute.get('/', blogcontrol.getBlog)


// GET SINGLE BLOG BY ID LOGGED IN OR NOT LOGGED IN


blogRoute.get('/:blogid', blogcontrol.getSingleBlog)

// OWNER CREATE BLOG

blogRoute.post('/create/:userid', passport.authenticate('jwt', { session: false }), blogcontrol.createBlog )

// GET OWNER'S BLOG POSTS

blogRoute.get('/myblog/:userid', passport.authenticate('jwt', { session: false }), blogcontrol.getOwnerBlogs)

// UPDATE BLOG STATE

blogRoute.patch('/updateState/:blogid', passport.authenticate('jwt', { session: false }), blogcontrol.updateBlogState)

// UPDATE BLOG POST

blogRoute.patch('/updatePost/:blogid', passport.authenticate('jwt', { session: false }), blogcontrol.updateBlogPost)

// DELETE A PARTICULAR BLOG POST 

blogRoute.delete('/deleteblog/:blogid', passport.authenticate('jwt', { session: false }), blogcontrol.deleteBlogPost)


module.exports = blogRoute