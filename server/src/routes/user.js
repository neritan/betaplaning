const express = require('express');
const User = require('../model/user');
const Task = require('../model/task');

const app = express();

app.route('/api/users')
    .get(async (req, res) => {
        try {
            const users = await User.find({});
            res.send(users);
        } catch (e) {
            res.status(500).send(e);
        }
    })
    .post(async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).send(user);
        } catch (e) {
            res.status(400).send(e);
        }
    });

app.route('/api/users/:userId')
    .get(async (req, res) => {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.send(user);
        } catch (e) {
            res.status(500).send(e);
        }
    })
    .patch(async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).send('User not found');
            }

            updates.forEach(update => user[update] = req.body[update]);
            await user.save();
            res.send(user);
        } catch (e) {
            res.status(400).send(e);
        }
    })
    .delete(async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);
            if (!user) {
                return res.status(404).send('User not found');
            }
            await Task.deleteMany({ owner: req.params.userId });
            res.send(user);
        } catch (e) {
            res.status(500).send(e);
        }
    });

module.exports = app;