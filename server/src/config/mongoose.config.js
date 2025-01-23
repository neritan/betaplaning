const mongoose  = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/mern")
.then(() => console.log("Connection Mongo Established!!"))
.catch(err => console.log("Connection Mongo Error", err));