const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email address');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
    const user = this.toObject();
 
    delete user.password;
    delete user.tokens;
 
    return user;
  };

  userSchema.pre('save', async function (next) {
    const user = this;
 
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8);
    }
 
    next();
  });

  const User = mongoose.model('User', userSchema);

  module.exports = User;  