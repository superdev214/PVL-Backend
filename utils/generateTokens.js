const jwt = require("jsonwebtoken");
const UserToken = require("../model/userToken");
const config = require("../config/config");

const jwt_key = config.jwt_key;
const refresh_key = config.refresh_key;
const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id };
    const accessToken = jwt.sign(payload, jwt_key, { expiresIn: "2h" });
    const refreshToken = jwt.sign(payload, refresh_key, { expiresIn: "30d" });

    const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) await userToken.remove();

    await new UserToken({ userId: user._id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return Promise.reject(err);
  }
};
