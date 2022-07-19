const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        minlenght: 6,
        maxlenght: 20
    },
    email: {
        type: String,
        required: true,
        minlenght: 10,
        maxlenght: 50
    },
    password: {
        type: String,
        required: true,
        minlenght: 6,
        maxlenght: 30
    },
    admin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;