const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors");
const authRoute = require("./routes/auth")
const destinationRoute = require("./routes/destinations")
const userRoute = require("./routes/users")
const app = express()

dotenv.config()

const host = process.env.HOST || 3000 

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

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.use(express.json())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/destinations", destinationRoute)
app.use(cors(corsOptions))

const cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

app.listen(port, () => {
    console.log(`Server is running`)
})