var express = require('express');
require('./src/config/mongoose.config');
const userRoutes = require('./src/routes/user');
const taskRoutes = require('./src/routes/task');
const userWithTasksRoutes = require('./src/routes/userWithTasks');
var app = express();

const port = 3080;


app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);
app.use(userWithTasksRoutes);

app.listen( port, () => console.log(`Listening on port: ${port}`) );
