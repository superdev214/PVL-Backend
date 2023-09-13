const dotenv = require("dotenv");
dotenv.config();
const config = {
    app: {
        port: 8080
    },
    db : {
        url : process.env.DATABASE_URL,
    },
    jwt_key : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    refresh_key: "hniownvopqoifUASDKFSDFKWEFJ^&#as0",
};

module.exports = config;