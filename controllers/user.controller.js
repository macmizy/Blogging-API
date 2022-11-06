
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function userLogin(req,res,next){
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
                    
                    const token = jwt.sign({ user: body }, process.env.SECRET_KEY, { expiresIn: "1h"});

                    return res.status(200).json({ token });
                }
            );
        } catch (error) {
            return next(error);
        }
    }
    )(req, res, next);
}

function userSignup(req,res,next){
    try{
       res.status(200).json({
        message: 'Signup successful',
        user: req.user
    }); 
    }catch(error){
        return res.status(400).json({
            status: "false",
            message: "Signup failed"
        })
    }
    
}

module.exports ={
    userLogin,
    userSignup
}