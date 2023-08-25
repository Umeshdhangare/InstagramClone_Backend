const jwt = require("jsonwebtoken");
const secretKeys = require("./keys");

const generateAccessToken = (user) => {
    return jwt.sign(
        {username: user.username, role: user.role, _id: user._id},
        secretKeys.accessKey
    );
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {username: user.username, role: user.role, _id: user._id},
        secretKeys.refreshKey
    )
}

module.exports = {generateAccessToken, generateRefreshToken};