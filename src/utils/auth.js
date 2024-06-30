const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, config.jwtSecret, {
    expiresIn: "30m",
  });
};

const generateRefreshToken = (userId) => {
  console.log("id from generate refresh token", userId);
  return jwt.sign({ sub: userId }, config.refreshTokenSecret, {
    expiresIn: "24h",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
