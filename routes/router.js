const auth = require("../middleware/auth");

module.exports = (app) => {
  const user = require("../controllers/userController");
  const accountTypeList = require("../controllers/accountTypeController");
  const account = require("../controllers/accountController");
  const upload = require("../utils/upload");

  let router = require("express").Router();
  // User Router
  router.post("/register-user", user.register);
  router.post("/login", user.login);
  router.get("/get-current-user", user.getCurrentUser);

  router.post("/add-account-to-cart", user.addAccountToCart);
  router.get("/get-all-cart", user.getAllCart);

  router.post(
    "/register-account-type",
    upload.single("avatar"),
    accountTypeList.addType
  );
  router.get("/get-all-account-type/", accountTypeList.findAllorName);
  router.post("/add-account", account.addAccount);

  router.post('/send-account-info',user.sendAccountInfoByEmail);
  // router.p`ost("/login", user.login);
  // Tutorial Router
  //  router.get("/",    auth,tutorials.findAllorTitle);
  //  router.post("/",   auth,tutorials.create);
  //  router.delete("/", auth,tutorials.deleteAll);
  // router.get("/:id",tutorials.findOne);
  // router.post("/:id",tutorials.update);
  app.use("/", router);
};
