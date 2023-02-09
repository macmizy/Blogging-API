const express = require('express')
const passport = require('passport')
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
const session = require('express-session')
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
    console.log(err)
    res.status(500).send('Something broke!')
})

PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})