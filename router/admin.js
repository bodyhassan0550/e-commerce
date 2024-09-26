const express = require("express")
const productControl = require("../controller/product")
const isadmin = require("../middleware/isAdmin")
const router = express.Router()

router.get("/admin", isadmin, productControl.getAdminProduct);
router.get("/admin/add-product", isadmin, productControl.addProduct);
router.post("/admin/add-product", isadmin, productControl.postaddProduct);
router.post("/admin/delete-product", isadmin, productControl.deleteProduct);
router.get(
  "/admin/edit-product/:productId",
  isadmin,
  productControl.getupdateProduct
);
router.post("/admin/edit-product", isadmin, productControl.updateProduct);
module.exports=router
