const express = require('express');
const passport = require('passport');
const userModel = require('../models/user.model');
const {userLogin,userSignup} = require('../controllers/user.controller')
require('dotenv').config();

const userRoute = express.Router()

userRoute.post(
    '/signup',
    passport.authenticate('signup', { session: false }), userSignup
)

userRoute.post(
    '/login',userLogin
)


userRoute.get('/allusers', async(req,res)=>{
    try{
        const allusers = await userModel.find()
        return res.send(allusers)
    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: "false",
            message: "Users not found"
        })
    }
})

module.exports = userRoute