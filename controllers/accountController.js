const Account = require("../model/account");

exports.addAccount = async (req, res) => {
  try {
    console.log(req.body);
    const account_type = {
      typename: req.body.accountType.toLowerCase(),
      email: req.body.emailAddress,
      password: req.body.password,
    };
    const list = await Account.create(account_type);
   return res.status(200).send("success");
  } catch (error) {
    res.status(409).send(error);
  }
};