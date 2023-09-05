const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");

mongoose.connect(dbConfig.url, 
  { 
    useNewUrlParser: true ,
    // useUnifiedTopology: true,
    // useCreateIndex:true,
    // useFindAndModify: false,
  });
const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected", dbConfig.url);
});
db.on("error", (err) => {
  console.log("DB connection failed.")
  console.log(err);
});
module.exports = db;
