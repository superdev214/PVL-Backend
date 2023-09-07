const bcrypt = require("bcrypt");
const User = require("../model/user");
const AccountType = require("../model/accountType");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const jwt_key = config.jwt_key;
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate user input : frontend side
    // check if user already exist
    const oldUser = await User.findOne({ email: email.toLowerCase() });

    if (oldUser)
      return res.status(409).send("This email already exist. Please Login");
    //@ User don't exist
    //@ Create user in our database
    const salt = await bcrypt.genSalt(Number(15));
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
    });

    // const token = jwt.sign(
    //   {
    //     user_id: user._id,
    //     email,
    //   },
    // jwt_key,
    //   { expiresIn: "2h" }
    // );
    // // // save user token

    // return new user
    res.status(200).send({ msg: "success" });
  } catch (err) {
    console.log(err);
  }
  /**bcrypt password is temporary suspend */
};

exports.login = async (req, res) => {
  try {
    // Get user data
    const { email, password } = req.body;
    // Validate your input
    // if (!(email && password)) res.status(400).send("All input is required");
    //Validate if the user exist in database
    if (email === "admin" && password === "12345678") {
      const token = jwt.sign(
        {
          user_email: "admin@admin.gmail",
          user_name: "admin",
        },
        jwt_key,
        { expiresIn: "30d" }
      );
      // save user token
      res.status(200).send({
        msg: "Admin success",
        token: token,
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) res.status(401).send("Invalid Credentials");
      const token = jwt.sign(
        {
          user_id: user._id,
          user_email: user.email,
          user_name: user.name,
        },
        jwt_key,
        { expiresIn: "30d" }
      );
      // save user token
      user.token = token;

      res.status(200).send({
        msg: "success",
        token: token,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.body.token || req.headers["x-access-token"];
    try {
      console.log("start current user");
      const decoded = jwt.verify(token, config.jwt_key);
      const user = {
        name: decoded.user_name,
        email: decoded.user_email,
      };

      res.status(200).send(user);
    } catch (err) {
      return res.status(401).send("You need to log in again!");
    }
  } catch (error) {
    res.status(409).send(error);
  }
};

exports.addAccountToCart = async (req, res) => {
  try {
    const { user_email, typename } = req.body;
    const user = await User.findOne({ email: user_email.toLowerCase() });
    const existingAccountType = user.addcarts.find(
      (item) => item.typename === typename
    );
    if (existingAccountType) {
      existingAccountType.count += 1;
    } else {
      user.addcarts.push({ typename: typename, count: 1 });
    }
    await user.save();
    let total_price = 0;
    for (const item of user.addcarts) {
      const accountType = await AccountType.findOne({
        typename: item.typename,
      });
      if (accountType) {
        total_price += accountType.priceLifeTime * item.count;
      }
    }
    res.status(200).send({ message: "success", total_price: total_price });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
exports.getAllCart = async (req, res) => {
  try {
    console.log("hi");
    const email = req.query.email;
    console.log(email);
    const user = await User.findOne({ email: email.toLowerCase() });
    let total_price = 0;
    console.log(user);
    for (const item of user.addcarts) {
      const accountType = await AccountType.findOne({
        typename: item.typename,
      });
      if (accountType) {
        total_price += accountType.priceLifeTime * item.count;
      }
    }
    res.status(200).send({ addcart: user.addcarts, totalPrice: total_price });
    // res.status(200).send("okay");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
