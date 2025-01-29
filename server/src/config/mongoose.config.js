const mongoose  = require("mongoose");
require('dotenv').config();


mongoose.connect(process.env.DB_URL)
.then(() => console.log("Connection Mongo Established!!"))
.catch(err => console.log("Connection Mongo Error", err));