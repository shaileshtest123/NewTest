const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    playerid:{
      type:Number,
      required : true
    },
    score: {
       type:Number,
       required : true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model("userscore", userSchema);

module.exports = userModel;
