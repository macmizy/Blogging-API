const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blogModel = require('../models/blog.model')
require('dotenv').config();

const userRoute = express.Router()

userRoute.post(
    '/signup',
    passport.authenticate('signup', { session: false }), async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

userRoute.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const error = new Error('Username or password is incorrect');
                    return next(error);
                }

                req.login(user, { session: false },
                    async (error) => {
                        if (error) return next(error);

                        const body = { _id: user._id, email: user.email };
                        
                        const token = jwt.sign({ user: body }, process.env.SECRET_KEY, { expiresIn: "1h",});

                        return res.status(200).json({ token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
        )(req, res, next);
    }
);

userRoute.post('/blog/:id', async(req,res)=>{
    try{
        const body = req.body
        const Id = req.params.id
        function readings(){
            let wpm = 200
            let wordcount = body.body.split(" ").length
            const division = wordcount / wpm
            if(division <= 1){
                const newtime = division * 60
                let readingTime = `${newtime} seconds`
                return readingTime
            }
            let time = Math.round(division)
            let readingTime = `${time} minutes`
            return readingTime
        }
        const newBody= {...body,userId:Id,reading_time: readings(),}
        const blog = await blogModel.create(newBody)
        if(!blog){
            return res.status(404).json({ status: false, blog: null })
        }

        const user = await userModel.findByIdAndUpdate(Id, {$push:{blogsId: blog._id}},{new: true})
        user.save()
        
        res.status(200).send(blog)

    }catch(err){
        console.log(err)
        res.json(err)
    }

})


userRoute.get('/blog/:id', async(req,res)=>{
    try{
        const {page, state} = req.query
        console.log(req.query)
        const Id = req.params.id
        const limit = 2
        const skip = (page-1) * limit

        if(state == "draft"){
            const blogs = await blogModel.find({userId: Id, state: 'draft'}).limit(limit).skip(skip)
            return res.status(200).json(blogs)
        }
        if(state == "published"){
            const blogs = await blogModel.find({userId: Id, state: 'published'}).limit(limit).skip(skip)
            return res.status(200).json(blogs)
        }
        const blogs = await blogModel.find({userId: Id}).limit(limit).skip(skip)
        res.status(200).json(blogs)

    }catch(err){
        console.log(err)
        res.send(err)
    }
})

userRoute.get('/allusers', async(req,res)=>{
    try{
        const allusers = await userModel.find()
        return res.send(allusers)
    }catch(err){
        console.log(err)
        return res.send(err)
    }
})

module.exports = userRoute