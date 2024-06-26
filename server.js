const express = require("express");
const config = require("././config/config");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./model/");
const app = express();
dotenv.config();
console.log(process.env.DATABASE_URL);
/**
 *  Feature : This code allows you to access the server
              In detail, 3001 port can fetch this server
 *  Reason  : If you don't have cors, you will have an error owing to browser security
 * 
 */
app.use(
  cors({
    origin: "*", //FrontEnd port : 3000
  })
);
//end
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public/`));
/////////////////////////////////////////////
require("./routes/router")(app);
app.listen(config.app.port);
