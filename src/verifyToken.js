const jwt = require('jsonwebtoken')
const User = require('./userModel')

const verifyToken = (req,res,next) => {
    const auth = req.headers.authorization
    if(auth){
        const token = auth.split(" ")[1]
        jwt.verify(token,process.env.PRIVATEKEY,(err,decode)=>{
            if(err){
                res.send({message:"Token Invalid / Expired"})
            }
            const user = User.findOne({decode : decode.email})
            if(!user){
                res.send({message:"User Not Found"})
            }
        })
        next()
    }
    else{
        res.send({message:"NO AUTH"})
    }
}

module.exports = verifyToken