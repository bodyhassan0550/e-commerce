const express = require("express")
const productControl = require("../controller/product")

const router = express.Router()

router.get("/", productControl.getProduct);
router.get("/admin", productControl.getAdminProduct);
router.get("/admin/add-product", productControl.addProduct);
router.post("/admin/add-product", productControl.postaddProduct);
router.post("/admin/delete-product", productControl.deleteProduct);
router.get("/admin/edit-product/:productId", productControl.getupdateProduct);
router.post("/admin/edit-product", productControl.updateProduct);
module.exports=router
