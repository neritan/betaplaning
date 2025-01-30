const express = require('express');
require('./src/config/mongoose.config');
const userRoutes = require('./src/routes/user');
const tasksRoutes = require('./src/routes/tasks');
const usersWithTasksRoutes = require('./src/routes/usersWithTasks');
const cors = require('cors');
// Add cors
const app = express();

app.use(
    cors(),
    express.json(),
    express.urlencoded({extended: true})
);
app.use(userRoutes);
app.use(tasksRoutes);
app.use(usersWithTasksRoutes);

// Start server
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});