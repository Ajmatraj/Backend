
// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "app"


dotenv.config({
    path: './env'
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`)
    })

    app.on("error", (error) => {
        console.log("ERROR: ", error);
        throw error
    })
})

.catch((err)=>{
    console.log("MONGODB db connection FAILED !!!", err);

})








// 1. using first approch for connecting DB.
/*
import express from "express"
const app   = express()

(async() => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    //    lissner for error using on
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error
        })

        // application is listing on port.
        app.listen(process.env.PORT, () => {
            console.log(`App is listing on porgt ${process.env.PORT}`)
        })

    } catch (error) {
        console.log("ERROR: ", error)
        throw err   
    }
})()
*/
