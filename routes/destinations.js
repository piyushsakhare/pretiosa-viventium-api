const router = require("express").Router()
const User = require("../models/User")
const Destination = require("../models/Destination")
const CryptoJS = require("crypto-js")
const verify = require("./verifyToken")

// Create

router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin) {
        const newDestination = new Destination(req.body)
        try {
           const savedDestination = await newDestination.save()
           res.status(200).json(savedDestination)
        }catch (err) {
            res.status(500).json(err)
        }
    }
})

// Update

router.put("/:id", verify, async (req,res) => {
    if(req.user.isAdmin){

        try{

            const updatedDestination = await Destination.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true })

            res.status(200).json(updatedDestination)

        }catch(err) {
            req.statusCode(500).json(err)
        }
    }else {
        req.statusCode(403).json("token not valid")
    }
})

// Delete

router.delete("/:id", verify, async (req,res) => {
    if(req.user.isAdmin){
        try{

            await Destination.findByIdAndDelete(req.params.id)

            res.status(200).json("Destination has been deleted")

        }catch(err) {
            req.statusCode(500).json(err)
        }
    }else {
        req.statusCode(403).json("token not valid")
    }
})

// Get

router.get("/find/:id", verify, async (req, res) => {
        try{
            const destination = await Destination.findById(req.params.id)
            res.status(200).json(destination)
        }catch (err) {
            res.status(500).json(err)
        }
})

// Get all

router.get("/", verify, async (req, res) => {
    const type = req.query.type
    const location = req.query.location
    let Destinations = []
    try{
        if(type){
            if(location) {
                Destinations = await Destination.find().aggregate([
                    { $match : { type : type, location : location}}
                ])
            }
            Destinations = await Destination.find().aggregate([
                { $match : { type : type}}
            ])
        }
            else {
                Destinations = await Destination.find().aggregate([
                    { $match : { size : 12}}
                ])
            }

            res.status(200).json(Destinations)
        
    }catch(err) {
        req.statusCode(500).json(err)
    }
})


module.exports = router