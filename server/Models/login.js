const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
       type: String,
       required : true
    },
    score: {
       type:Number,
       required : true
    }
});

const loginModel = mongoose.mongoose.model("employees", loginSchema);

module.exports = loginModel;
