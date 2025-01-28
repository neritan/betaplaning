const express = require('express');
const Task = require('../model/task');
const app = express();

app.route('/api/tasks')
    .get(async (req, res) => {
        const match = {};
        const sort = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        if (req.query.owner) {
            match.owner = req.query.owner;
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        try {
            const tasks = await Task.find(match)
                .sort(sort)
                .limit(parseInt(req.query.limit) || 10)
                .skip(parseInt(req.query.skip) || 0);
            res.send(tasks);
        } catch (e) {
            res.status(500).send(e);
        }
    });

app.route('/api/tasks/:taskId')
    .patch(async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'description', 'completed', 'dueDate'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        try {
            const task = await Task.findById(req.params.taskId);
            if (!task) {
                return res.status(404).send('Task not found');
            }

            updates.forEach(update => task[update] = req.body[update]);
            await task.save();
            res.send(task);
        } catch (e) {
            res.status(400).send(e);
        }
    });

app.route('/api/tasks/:taskId/assign/:userId')
    .patch(async (req, res) => {
        try {
            const task = await Task.findByIdAndUpdate(
                req.params.taskId,
                { owner: req.params.userId },
                { new: true }
            );
            if (!task) {
                return res.status(404).send('Task not found');
            }
            res.send(task);
        } catch (e) {
            res.status(400).send(e);
        }
    });

app.route('/api/tasks/stats')
    .get(async (req, res) => {
        try {
            const stats = await Task.aggregate([
                {
                    $group: {
                        _id: '$completed',
                        count: { $sum: 1 },
                        tasks: { $push: { title: '$title', dueDate: '$dueDate' } }
                    }
                }
            ]);
            res.send(stats);
        } catch (e) {
            res.status(500).send(e);
        }
    });

module.exports = app;