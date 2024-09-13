const express = require("express")
const bcrypt = require("bcrypt")
const User = require("./userModel")
const generateToken = require("./token")
const verifyToken = require("./verifyToken")

const userRouter = express.Router()

userRouter.get('/users',async(req,res)=>{
    try {
        const allUsers = await User.find()
        res.send(allUsers)
    } catch (error) {
       res.send(error) 
    }
})

userRouter.get('/users/:id',async(req,res)=>{
    const id = req.params.id
    try {
        const selectedUsers = await User.findById(id)
        res.send(selectedUsers)
    } catch (error) {
       res.send(error) 
    }
})

userRouter.get(
    '/auth-page',
    verifyToken,
    (req,res)=>{ res.send("<h1>Welcome User</h1>") }
)

userRouter.post('/create-user',async(req,res)=>{
    try {
        const {username,email,password} = req.body
        const user = await User.findOne({email})
        // console.log(user);
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


userRouter.post('/login-user',async(req,res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.send({message:"user not exists"})
        }
        else{
            const comparePassword  = await bcrypt.compare(password,user.password)
            if(!comparePassword){
                return res.send({message:"incorrect password"})
            }else{
                const token = generateToken(user)
                res.send({tokenValue:token,userName:user.username,message:"Logged in Successfully"})
            }
        }
    } catch (error) {
        res.send(error)
    }
})



userRouter.put('/update-user/:id',async(req,res)=>{
    try {
        const id = req.params.id
        const {username,email,password} = req.body

        const user = await User.findOne({email})
        if(user){
            return res.send({message:"user already exists"})
        }else{
            const hashPassword  = await bcrypt.hash(password,10)
            await User.findByIdAndUpdate(id,{username,email,password:hashPassword})
         res.send({message:"User Updated Successfully"})
        }
         
    } catch (error) {
        res.send(error)
    }
})

userRouter.delete('/delete-user/:id',async(req,res)=>{
    const id = req.params.id
    try {
        const user = await User.findById(id)
        if(!user){
            return res.send({message:"User Not Found"})
        }else{
            await User.findByIdAndDelete(id)
            res.send({message:"User Deleted Successfully"})
        }
        
    } catch (error) {
        res.send({message:error})
    }
})


module.exports  = userRouter 
