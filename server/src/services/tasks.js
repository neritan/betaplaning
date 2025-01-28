const Task = require('../model/task');

class TaskService {
    async createTask(taskData) {
        try {
            const task = new Task(taskData);
            await task.save();
            return task;
        } catch (error) {
            throw error;
        }
    }

    async getTasks(filters = {}) {
        try {
            const tasks = await Task.find(filters).populate('owner', 'name email');
            return tasks;
        } catch (error) {
            throw error;
        }
    }

    async getTaskById(taskId) {
        try {
            const task = await Task.findById(taskId).populate('owner', 'name email');
            if (!task) {
                throw new Error('Task not found');
            }
            return task;
        } catch (error) {
            throw error;
        }
    }

    async updateTask(taskId, updates) {
        const allowedUpdates = ['title', 'description', 'completed', 'dueDate'];
        const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new Error('Invalid updates!');
        }

        try {
            const task = await Task.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }

            Object.keys(updates).forEach(update => task[update] = updates[update]);
            await task.save();
            await task.populate('owner', 'name email');
            return task;
        } catch (error) {
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            const task = await Task.findById(taskId);
            if (!task) {
                throw new Error('Task not found');
            }
            await task.deleteOne();
            return task;
        } catch (error) {
            throw error;
        }
    }

    async getTasksByOwner(ownerId) {
        try {
            const tasks = await Task.find({ owner: ownerId }).populate('owner', 'name email');
            return tasks;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TaskService();
