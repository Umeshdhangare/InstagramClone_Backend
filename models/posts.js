const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new Schema({
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
        // type: ObjectId,
        // ref: 'User',
        type:String,
        default:'Umesh',
        required: true
    }
    // likes:[
    //     {
    //         type: ObjectId,
    //         ref: 'User'
    //     }
    // ],
    // comments: [
    //     {
    //         text: String,
    //         postedBy: {
    //             type: ObjectId,
    //             ref: 'User',
    //             required: true
    //         }
    //     }
    // ]
});

module.exports = Post = mongoose.model('Post', postSchema);