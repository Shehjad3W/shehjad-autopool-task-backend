const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"]
    },
    about: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;