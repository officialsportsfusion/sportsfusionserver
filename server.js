const express = require('express')
const path = require("path");
const dotenv = require('dotenv')
const router = require('./src/router')
const cors = require('cors')
const connectDB = require('./src/database')
dotenv.config()

const port = process.env.PORT

const app = express()
// app.use(cors())

app.use(cors());
app.use(express.json());
app.use(router)

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "src", "views"));

 app.listen(port , ()=>{
    console.log('Server Is Running')
})


connectDB().then((con)=>{
    console.log('Connected To DataBase')
})
