const jwt = require('jsonwebtoken')

const generateToken = (user) => jwt.sign(
    {userId : user._id},
    process.env.PRIVATEKEY,
    {expiresIn : "2m"}
)

module.exports = generateToken