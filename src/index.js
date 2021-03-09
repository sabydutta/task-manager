const express = require("express")
require('../src/db/mongoose.js')
const userRouter = require('../src/router/user')
const taskRouter = require('../src/router/task')
const bcrypt = require('bcryptjs')
const User = require('./models/user')
const Task = require('./models/task')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const app = express()
const port = process.env.PORT

//Automatically parses the json sent in req  to be used in the endpoints
app.use(express.json())
//Router path 
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server is up on port " + port)
})




