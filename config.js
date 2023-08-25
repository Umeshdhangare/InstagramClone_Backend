const mongoose = require("mongoose");

const URI = "mongodb+srv://test_user:qwertyumesh@cluster0.qvlkilj.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        const con = await mongoose.connect(URI);
        console.log("DB connected successfully!");
    } catch(e) {
        console.log("Authentication to databse failed");
        process.exit(1);
    }
}

module.exports = connectDB;