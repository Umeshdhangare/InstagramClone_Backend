var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId } = mongoose.Schema.Types;

var postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'No Photo',
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    likes:[
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            text: String,
            postedBy: {
                type: ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
});

module.exports = Posts = mongoose.model('Post', postSchema);