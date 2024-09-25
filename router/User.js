const express = require("express")
const userControl = require("../controller/user")
const { check } = require("express-validator");

const router = express.Router()

router.get("/signup",userControl.getSignup);
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Enter valid E-mail "),
    check("password").isLength({ min: 5 }).withMessage("password is too short"),
  ],
  userControl.postSignup
);
router.get("/login", userControl.getlogin);
router.post("/login", userControl.postlogin);
router.post("/logout", userControl.postlogout);

module.exports = router;
