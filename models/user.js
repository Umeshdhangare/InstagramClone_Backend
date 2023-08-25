var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId } = mongoose.Schema.Types;

var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        min:3,
        max: 15,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    description: {
        type: String,
        max: 50,
        default: ""
    },
    profilePicture: {
        type: String,
        default: "YOUR_DEFAULT_AVATAR_URL"
    },
    followers: {
        type:Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true,
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    jwtToken: {
        type: String
    }
});

module.exports = Users = mongoose.model('User', userSchema);