const mongoose = require('mongoose');

 const taskSchema = new mongoose.Schema({
   title: {
     type: String,
     required: true
   },
   description: {
     type: String,
     required: true
   },
   completed: {
     type: Boolean,
     default: false
   },
   dueDate: {
     type: Date
   },
   owner: {
     type: mongoose.Schema.Types.ObjectId,
     required: true,
     ref: 'User'
   }
 }, { collection: 'task',
   timestamps: true
 });

 const Task = mongoose.model('Task', taskSchema);

 module.exports = Task;