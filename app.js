const express = require('express')
const passport = require('passport')
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
const session = require('express-session')
const rateLimit = require('express-rate-limit')
const helmet = require("helmet");
const logger = require('./logger/logger')
require('dotenv').config()
require('./db').connectToMongoDB()
require("./authentication/auth")
require("./authentication/google")


const app = express()

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));
app.use(passport.initialize());
app.use(passport.session());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)

app.use(helmet());

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views','views')
app.set('views engine','ejs')

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.get("/",(req,res)=>{
    
    res.send({message: "Welcome "})
})

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));


app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/blog/',
        failureRedirect: '/',
}))

app.get('/logout', (req,res)=>{
    req.logout()
    req.session.destroy()
    res.send({message: 'goodbye!'})
})

app.use((err,req,res,next)=>{
    logger.error(err.message)
    res.status(500).send('Something broke!')
})

PORT = process.env.PORT

app.listen(PORT,()=>{
    logger.info(`Server is running on PORT ${PORT}`)
})