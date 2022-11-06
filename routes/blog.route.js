const express = require('express')
const blogModel = require('../models/blog.model')
const userModel = require('../models/user.model')
const passport = require('passport')
const blogcontrol = require('../controllers/blog.controller')

const blogRoute = express.Router()



// GET A LIST OF BLOG LOGGED IN OR NOT LOGGED IN

blogRoute.get('/', blogcontrol.getBlog)


// GET SINGLE BLOG BY ID LOGGED IN OR NOT LOGGED IN


blogRoute.get('/:id', blogcontrol.getSingleBlog)

// OWNER CREATE BLOG

blogRoute.post('/create/:id', passport.authenticate('jwt', { session: false }), blogcontrol.createBlog )

// GET OWNER'S BLOG POSTS

blogRoute.get('/myblog/:id', passport.authenticate('jwt', { session: false }), blogcontrol.getOwnerBlogs)

// UPDATE BLOG STATE

blogRoute.patch('/updateState/:id', passport.authenticate('jwt', { session: false }), blogcontrol.updateBlogState)

// UPDATE BLOG POST

blogRoute.patch('/updatePost/:id', passport.authenticate('jwt', { session: false }), blogcontrol.updateBlogPost)

// DELETE A PARTICULAR BLOG POST 

blogRoute.delete('/deleteblog/:id', passport.authenticate('jwt', { session: false }), blogcontrol.deleteBlogPost)


module.exports = blogRoute