const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

// Sign Up

router.post("/signup", async (req,res) => {
    const newUser = new User({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
        isAdmin : req.body.isAdmin
    })

    try{
        const user = await newUser.save()
        res.json(user)
    }catch(err) {
        console.log(err)
    }
})

// Sign In

router.post("/login", async (req,res) => {
    try{
        const user = await User.findOne({email : req.body.email})
        !user && res.status(401).json("Worng email or password")

        const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8)

        originalPassword !== req.body.password && res.status(401).json("Worng email or password")

        const accessToken = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.SECRET_KEY, {expiresIn : "5d"})

        const {password, ...info} = user._doc

        res.status(200).json({...info, accessToken})
    }catch(err){
        res.status(400).json()
    }
})

module.exports = router