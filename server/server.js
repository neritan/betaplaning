const express = require('express');
require('./src/config/mongoose.config');
const userRoutes = require('./src/routes/user');
const tasksRoutes = require('./src/routes/tasks');
const usersWithTasksRoutes = require('./src/routes/usersWithTasks');

const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(tasksRoutes);
app.use(usersWithTasksRoutes);

// Start server
const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});