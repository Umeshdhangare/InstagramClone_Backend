var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId } = mongoose.Schema.Types;

var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: ObjectId,
            ref:'User' 
        }
    ]
});

module.exports = Users = mongoose.model('User', userSchema);