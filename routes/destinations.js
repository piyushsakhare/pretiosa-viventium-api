const router = require("express").Router()
const Destination = require("../models/Destination")
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
            console.log(err)
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

// Get all destinations

router.get("/", async (req, res) => {
    const type = req.query.type
    const location = req.query.location
    try{
        if(type){
            if(location) {
                const partialToMatch= new RegExp(location,'i')
                const Destinations = await Destination.aggregate([
                    { $match : { type : type, location : partialToMatch }}
                ])
                res.status(200).json(Destinations)
            }
            const Destinations = await Destination.aggregate([
                { $match : { type : type}}
            ])
            res.status(200).json(Destinations)
        }
            else {
                const Destinations = await Destination.find()
                res.status(200).json(Destinations)
            }

            
        
    }catch(err) {
        res.status(500).json(err)
        
    }
})


module.exports = router