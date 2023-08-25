var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { ObjectId } = mongoose.Schema.Types;

var postSchema = new Schema({
    user: {type: ObjectId, ref: "User"},
    description: { type: String, max:500},
    imgurl: {type: String},
    likes:[{type: ObjectId, ref: "User"}],
    comments: [{ type: ObjectId, ref: "Comment"}]
    }, 
    {
    timestamps: true
    }
);

module.exports = mongoose.model('Post', postSchema);