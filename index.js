const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const authRoute = require("./routes/auth")
const destinationRoute = require("./routes/destinations")
const userRoute = require("./routes/users")
const app = express()

dotenv.config()


const port = process.env.PORT || 8800

mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(() => {
    console.log("DB connection succesful")
})
.catch((err) => {
    console.log(err)
})


 app.use(cors({
     origin : "*",
     credentials : true
 }))

app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/destinations", destinationRoute)





app.listen(port, () => {
    console.log(`Server is running`)
})