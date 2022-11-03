const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { request } = require('express');
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
                        
                        const token = jwt.sign({ user: body }, process.env.SECRET_KEY, { expiresIn: "2h",});

                        return res.json({ token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
        )(req, res, next);
    }
);

userRoute.post('/myblogs/:id', async(req,res)=>{
    try{
        const body = req.body
        const Id = req.params.id
        const blog = await blogModel.create(body)
        if(!blog){
            return res.status(404).json({ status: false, blog: null })
        }
        const pop = await userModel.findOneAndUpdate({_id: Id},{blogs: blog._id},{new: true})
        res.send({msg: 'created successfully'},{data: pop})

    }catch(err){
        console.log(err)
        res.json(err)
    }

})

userRoute.get('/myblogs/:id', async(req,res)=>{
    try{
        const Id = req.params.id
        const blog = await userModel.findOne({_id: Id}).populate('blogs')
        res.status(200).json(blog)

    }catch(err){
        console.log(err)
        res.send(err)
    }
})

module.exports = userRoute