const express = require("express")
const userControl = require("../controller/user")
const productControl = require("../controller/product");

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


router.get("/", productControl.getProduct);
router.get("/search", productControl.getSearchProduct);
router.get("/product/:id", productControl.getProductDetails);
router.get("/cart", productControl.getCart);
router.post("/cart/add", productControl.postAddCart);
router.post("/cart/increase-quantity", productControl.postIncQuan);
router.post("/cart/decrease-quantity", productControl.postDecQuan);
router.get("/orders", productControl.getOrder);
router.post("/order", productControl.postCreateOrder);
router.get("/checkout/success", productControl.postSuccessOrder);
router.get("/checkout/cancel", productControl.postCreateOrder);
module.exports = router;
