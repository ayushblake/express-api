require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./database.js')

//Tell that the request body will contain json
app.use(express.json())

//Global Middleware(runs before every request)
app.use((req, res, next) => {
    console.log(req.method + "--" + req.url)
    next()
})

db.on('error', () => console.log("Error Connecting To Database"))
//Checks if database is connected successfully or not
db.once('open', () => console.log("Successfully Connected To Database"))
//Here we have a used a router just as a good practise, so that we can divide our app to use different routers for different url params(like /subscriber, /user, /matches, etc..)
// Incase of a small app instead of dividing the app into different routers we can directly use: app.get('/',(req,res) => {})    **NOTE** This is not a good practise(Always try and use routers)
const subscribersRouter = require('./Routers/subscribersRouter')
app.use('/subscriber', subscribersRouter)

app.listen(process.env.PORT, () => { console.log("Server Started") })