const express = require('express')
const passport = require('passport')
const userRoute = require('./routes/user.route')
const blogRoute = require('./routes/blog.route')
require('dotenv').config()
require('./db').connectToMongoDB()
require("./authentication/auth")


const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views','views')
app.set('views engine','ejs')

app.use('/user', userRoute)
app.use('/blog', blogRoute)

app.get("/",(req,res)=>{
    
    res.send({message: "Welcome "})
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).send('Something broke!')
})

PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})