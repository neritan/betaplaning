const mongoose  = require("mongoose");
require('dotenv').config();


mongoose.connect(process.env.DB_MONGO_URI)
.then(() => console.log("Connection Mongo Established!!"))
.catch(err => console.log("Connection Mongo Error", err));