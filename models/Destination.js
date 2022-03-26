const mongoose = require("mongoose")

const DestinationSchema = new mongoose.Schema({
    title : {
        type: String,
        required : true,
    },
    description : {
        type: String,
        required : true,
    },
    price : {
        type: String,
        required : true,
        unique : false
    },
    image1 : {
        type : String,
        required : true
    },
    image2 : {
        type : String,
    },
    image3 : {
        type : String,
    },
    type : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model("Destination", DestinationSchema)