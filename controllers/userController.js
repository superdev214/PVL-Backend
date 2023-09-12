const bcrypt = require("bcrypt");
const User = require("../model/user");
const AccountType = require("../model/accountType");
const Account = require("../model/account");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const nodemailer = require("nodemailer");
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
      name: name.toLowerCase(),
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

    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { name: email.toLowerCase() }],
    });
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
    const email = req.query.email;
    const user = await User.findOne({ email: email.toLowerCase() });
    let total_price = 0;
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
exports.sendAccountInfoByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    const accountInfo = await Promise.all(
      user.addcarts.map(async (item) => {
        const { typename, count } = item;
        console.log(typename, count);
        const accounts = [];
        for (let i = 0; i < count; i++) {
          const account = await Account.findOne({
            typename: typename,
          });
          const { email, password } = account;
          console.log(email, password);
          accounts.push({ email, password });
        }
        return { typename: typename, accounts };
      })
    );
    console.log("accountInfo", accountInfo);
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "registration@flexon.io",
        pass: "ruvwgiaemvaqpmvh",
      },
    });
    let emailContent = "";
    accountInfo.forEach((item) => {
      const typenameFormatted = item.typename.charAt(0).toUpperCase() + item.typename.slice(1);
      emailContent += `<p style="font-size: 28px; font-weight: bold; color:blue">${typenameFormatted} account</p>`;
      item.accounts.forEach((account, index) => {
        emailContent += `<p style="font-size: 20px;">${index + 1}. Email: ${account.email}</p><br>`;
        emailContent += `<p style="font-size: 20px;">   Password: ${account.password}</p><br>`;
      });
      emailContent += "<br>";
    });
    emailContent +=`<p style="font-size:20px; font-weight:bold; color:red">Note: If your account information is incorrect or there is a problem with your account, please contact us.</p>`;
    const mailOptions = {
      from: "registration@flexon.io",
      to: email,
      subject: "Account Information",
      html: emailContent,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent successfully");
        res.status(200).send("Email sent successfully");
      }
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};