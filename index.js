const express = require("express")
require('dotenv').config()
const cors = require("cors")

const dbConnect = require("./src/db")
const userRouter = require("./src/userRouter")

const app = express()

app.use(express.json())
app.use(cors())
app.use('/',userRouter)

dbConnect()

app.get('/',(req,res)=>{
    res.send("<h1>Hi Express App</h1>")
})

const port = process.env.PORT

app.listen(port,()=>{
    console.log(`Sever started in Port : http://localhost:${port}`);
    
})