const TutorialSchema = require("../model/model");

/*
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

exports.findAllorTitle = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `${title}` } } : null;
  Tutorial.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error",
      });
    });
};
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  console.log(req.body.title);
  // Create a Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  };
  
  // Save Tutorial in the database
  Tutorial.create(tutorial)
    .then((msg) => {
      res.send({
        msg : "success"
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};
exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log(id);
  Tutorial.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(400).send({
          message: "Cannot find tutorial",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error" });
    });
};
exports.update = (req, res) => {
    const id = req.params.id;

    Tutorial.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tutorial was updated successfully."
          });
         
        } else {
          res.send({
            message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Tutorial with id=" + id
        });
      });
  };
  exports.deleteAll = (req, res) => {
    Tutorial.destroy({
      where : {},
      turncate : false
    }).then( num => {
      res.send({
        message : `${num} tutorials were deleted successfully`
      });
    }).catch(err => {
      res.status(500).send({
        message : err.message || "Some error occured",
      })
    })
  }
  */

exports.create = (req, res) => {
  console.log(req.body);
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published,
  };
  TutorialSchema.create(tutorial)
    .then((msg) => {
      res.send({
        msg: "success",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.findAllorTitle = (req, res) => {
  const title = req.query.title;
  console.log(title);
  if ((title === "") | (title === undefined)) {
    console.log("right");
    TutorialSchema.find()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some errors occured",
        });
      });
  } else {
    console.log("false");
    TutorialSchema.find({ title: `${title}` })
      .then((data) => {
        res.send(data);
        console.log(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: "Some errors occured",
        });
      });
  }
};
exports.findByTitle = (req, res) => {
  const title = req.query.title;
  console.log(req.query);
  TutorialSchema.find({ title })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Some errors occured",
      });
    });
};

exports.deleteAll = (req, res) => {
  TutorialSchema.deleteMany({})
    .then(function () {
      console.log("Data deleted"); // Success
      res.send({
        message: "All Remove ",
      });
    })
    .catch(function (error) {
      console.log(error); // Failure
    });
};

