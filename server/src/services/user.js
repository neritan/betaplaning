// server/src/services/user.js

const User = require('../model/user');
const Task = require('../model/task');

class UserService {
    async getAllUsers() {
        try {
            const users = await User.find({});
            return users;
        } catch (error) {
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, updates) {
        const allowedUpdates = ['name', 'email', 'password'];
        const isValidOperation = Object.keys(updates).every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            throw new Error('Invalid updates!');
        }

        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            Object.keys(updates).forEach(update => user[update] = updates[update]);
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            await Task.deleteMany({ owner: userId });
            await user.remove();
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserTasks(userId) {
        try {
            const tasks = await Task.find({ owner: userId });
            return tasks;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserService();
