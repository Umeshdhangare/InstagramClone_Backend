const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjetId } = mongoose.Schema.Types;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [
        {
            type: ObjetId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: ObjetId,
            ref:'User' 
        }
    ]
});

module.exports = User = mongoose.model('User', userSchema);