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
        unique: true,
        required: [true, "Email is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"]
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    poolDetails: {
        poolSerial: {
            type: Number,
            required: false,
            unique: true,
            index: true,
            sparse: true
        },
        adminSerial: {
            type: Number,
            required: false,
        }
    },

})

const User = mongoose.model('User', userSchema);
module.exports = User;