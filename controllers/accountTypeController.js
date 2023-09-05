const AccountType = require("../model/accountType");

exports.addType = async (req, res) => {
  try {
    console.log(req.body);
    const account_type = {
      typename: req.body.typename.toLowerCase(),
      description: req.body.description,
      avatar: req.file.filename,
      sellCount: 0,
    };
    const oldType = await AccountType.findOne({
      typename: account_type.typename,
    });
    if (oldType)
      return res.status(409).send("This account already exist. Please register another one.");
    const list = await AccountType.create(account_type);
    res.status(200).send(account_type);
  } catch (error) {
    res.status(409).send(error);
  }
};

// exports.findAllorTitle = (req, res) => {
//   const title = req.query.title;
//   console.log(title);
//   if ((title === "") | (title === undefined)) {
//     console.log("right");
//     TutorialSchema.find()
//       .then((data) => {
//         res.send(data);
//       })
//       .catch((err) => {
//         res.status(500).send({
//           message: "Some errors occured",
//         });
//       });
//   } else {
//     console.log("false");
//     TutorialSchema.find({ title: `${title}` })
//       .then((data) => {
//         res.send(data);
//         console.log(data);
//       })
//       .catch((err) => {
//         res.status(500).send({
//           message: "Some errors occured",
//         });
//       });
//   }
// };
// exports.findByTitle = (req, res) => {
//   const title = req.query.title;
//   console.log(req.query);
//   TutorialSchema.find({ title })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Some errors occured",
//       });
//     });
// };

// exports.deleteAll = (req, res) => {
//   TutorialSchema.deleteMany({})
//     .then(function () {
//       console.log("Data deleted"); // Success
//       res.send({
//         message: "All Remove ",
//       });
//     })
//     .catch(function (error) {
//       console.log(error); // Failure
//     });
// };
