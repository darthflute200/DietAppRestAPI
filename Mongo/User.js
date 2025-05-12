const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  FoodList:{
    type: [{
      brand: String,
      name: String,
      energy: String
    }],
  },
  TotalWater:{
    type:Number,
  },
  CurrentWater:{
    type:Number,
  }
});

module.exports = mongoose.model('User', userSchema);
