const express = require("express")
require('dotenv').config()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors())

const dbConnect = async() =>{
    try {
       await mongoose.connect(process.env.DBURL) 
       console.log("DB Connected Successfully");
    } catch (error) {
        console.log("DB Connection Failure : "+error)
    }
}

dbConnect()

const userSchema = new mongoose.Schema({
    username: {type:String,required:true},
    email : {type:String,required:true},
    password:{type:String,required:true},
})

const User = mongoose.model("users",userSchema)

app.get('/',(req,res)=>{
    res.send("<h1>Hi Express App</h1>")
})

app.get('/users',async(req,res)=>{
    try {
        const allUsers = await User.find()
        res.send(allUsers)
    } catch (error) {
       res.send(error) 
    }
})

app.get('/users/:id',async(req,res)=>{
    const id = req.params.id
    try {
        const selectedUsers = await User.findById(id)
        res.send(selectedUsers)
    } catch (error) {
       res.send(error) 
    }
})

app.post('/create-user',async(req,res)=>{
    try {
        const {username,email,password} = req.body
        const user = await User.findOne({email})
        if(user){
            return res.send({message:"user already exists"})
        }
        else{
            const hashPassword  = await bcrypt.hash(password,10)
            const newUser = new User({username,email,password:hashPassword})
            await newUser.save()
            res.send(newUser)
        }
    } catch (error) {
        res.send(error)
    }
})



const port = process.env.PORT

app.listen(port,()=>{
    console.log(`Sever started in Port : http://localhost:${port}`);
    
})


// const users = [
//     {id : 1,name:"MSD",age:42},
//     {id : 2,name:"Sachin",age:44}
// ]

// app.get('/users',(req,res)=>{
//     res.send(users)
// })

// app.get('/users/:id',(req,res)=>{
//     const {id} = req.params
//     const selectedUser = users.find(i => i.id == id)
//     res.send(selectedUser)
// })

