const jwt = require("jsonwebtoken");
const config = require("../config/config");
const jwt_key = config.jwt_key;

const verifyToken = (req,res,next) =>{
  const token = req.body.token || req.headers["x-access-token"];
  if(!token){
    return res.status(403).send("A token is required for authentication");
  }
  try{
    const decoded = jwt.verify(token, config.jwt_key);
  }catch(err){
    return res.status(401).send("You need to log in again!");
  }
  return next();
};
module.exports = verifyToken;