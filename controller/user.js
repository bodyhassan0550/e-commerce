const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.getSignup = (req, res, next) => {
  res.render("user/signup", {
    title: "SignUp",
    error: "",
  });
};
exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const Password = req.body.password;
  const confirmpassword = req.body.confirmpassword;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      console.log(errors.array()[0].path);
      return res.status(422).render("user/signup", {
        title: "SignUp",
        error: errors.array()[0].msg,
      });
    }

  if (Password !== confirmpassword) {
    return res.render("user/signup", {
      title: "SignUp",
      error: "password Not match",
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res.render("user/signup", {
          title: "SignUp",
          error: "this email is already exist",
        });
      }
      bcrypt
        .hash(Password, 12)
        .then((hashpassword) => {
          user = new User({
            name: name,
            email: email,
            password: hashpassword,
            cart: [],
          });
          user.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
      res.render("user/signup", {
        title: "SignUp",
        error: "An error occurred during signup", // Pass the error message if any issue happens
      });
    });
};

exports.getlogin = (req, res, next) => {
  res.render("user/login", {
    title: "Login",
    error: "",
  });
};
exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const Password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("user/login", {
          title: "Login",
          error: "email is not exist",
        });
      }
      bcrypt.compare(Password, user.password).then((match) => {
        if (!match) {
          return res.render("user/login", {
            title: "Login",
            error: "password is wrong",
          });
        }
        req.session.Isloggedin = true;
        req.session.user = user;
        if(user.IsAdmin){
           return req.session.save((err) => {
             console.log(err);
             res.redirect("/admin");
           });
        }
        return req.session.save((err) => {
          console.log(err);
          res.render("product/home", {
            user: req.session.user,
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("user/login", {
        title: "login",
        error: "An error occurred during signup", // Pass the error message if any issue happens
      });
    });
};
exports.postlogout=(req,res,next)=>{
    req.session.destroy(err=>{
        console.log(err)
        res.redirect("/login")
    })
}