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

 taskSchema.virtual('ownerUser', {
    ref: 'User',
    localField: 'owner',
    foreignField: '_id'
  });

 const Task = mongoose.model('Task', taskSchema);

 module.exports = Task;