const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/iNotebook"


const connectToMongo = ()=>{
    mongoose.connect(mongoURI).then(()=>{
        console.log("Connected to Mongo successfully")
    })
}

module.exports = connectToMongo;