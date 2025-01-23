var express = require('express');
require('./src/config/mongoose.config');

var app = express();

const port = 3080;

app.listen( port, () => console.log(`Listening on port: ${port}`) );