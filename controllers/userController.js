const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const jwt_key = config.jwt_key;
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate user input : frontend side
    // check if user already exist
    console.log("register");
    const oldUser = await User.findOne({ email : email.toLowerCase()});

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
    console.log(email);
    if(email === 'admin' && password === "12345678")
        res.status(200).send("Admin success");

    const user = await User.findOne({ email : email.toLowerCase()});
    if (user) {
      console.log("step 1");
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) res.status(401).send("Invalid Credentials");
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
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
