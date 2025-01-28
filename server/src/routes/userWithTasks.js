const mongoose = require('mongoose');
const express = require('express');
const User = require('../model/user');
const Task = require('../model/task');

const app = express();

app.route('/api/users/:userId/tasks')
    .get(async (req, res) => {
        try {
            const tasks = await Task.find({ owner: req.params.userId });
            res.send(tasks);
        } catch (e) {
            res.status(500).send(e);
        }
    })
    .post(async (req, res) => {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).send('User not found');
            }
            
            const task = new Task({
                ...req.body,
                owner: user._id
            });
            await task.save();
            res.status(201).send(task);
        } catch (e) {
            res.status(400).send(e);
        }
    });


app.route('/api/usersWithTasks')
    .get(async (req, res) => {
        try {
            const usersWithTasks = await User.aggregate([
                {
                    $lookup: {
                        from: 'task',
                        localField: '_id',
                        foreignField: 'owner',
                        as: 'tasks'
                    }
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        tasks: {
                            title: 1,
                            description: 1,
                            completed: 1,
                            dueDate: 1
                        }
                    }
                }
            ]);
            res.send(usersWithTasks);
        } catch (e) {
            res.status(500).send(e);
        }
    })

    app.route('/api/v2/usersWithTasks')
    .get(async (req, res) => {
        try {
            const users = await User.find({});
            await Promise.all(users.map(user => user.populate('tasks')));
            
            const usersWithTasks = users.map(user => ({
                name: user.name,
                email: user.email,
                tasks: user.tasks.map(task => ({
                    title: task.title,
                    description: task.description,
                    completed: task.completed,
                    dueDate: task.dueDate
                }))
            }));
            
            res.send(usersWithTasks);
        } catch (e) {
            res.status(500).send(e);
        }
    });

module.exports = app;