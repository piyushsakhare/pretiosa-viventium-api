const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const verify = require("./verifyToken")
const { route } = require("express/lib/application")

// Update

router.put("/:id", verify, async (req,res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
        }
        try{

            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })

            res.status(200).json(updatedUser)

        }catch(err) {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("token not valid")
    }
})

// Delete

router.delete("/:id", verify, async (req,res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        try{

            await User.findByIdAndDelete(req.params.id)

            res.status(200).json("User has been deleted")

        }catch(err) {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("token not valid")
    }
})

//Get all Users

router.get("/", verify,  async (req,res) => {
    if(req.user.isAdmin){
        try{

            const users = await User.find()

            res.status(200).json(users)

        }catch(err) {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("token not valid")
    }
})

// Get User Stats

router.get("/stats", verify, async (req, res) => {
    if(req.user.isAdmin){

        try{
            const data = await User.find().limit(5)
            res.status(201).json(data)
        }catch(err) {
            res.status(403).json(err)
        }
    }
})



module.exports = router