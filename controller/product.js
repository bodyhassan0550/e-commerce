const product = require("../models/product");
const Product = require("../models/product");
const User = require("../models/user");

exports.getProduct = (req, res, next) => {
  Product.find().then((product) => {
    res.render("admin/home", {
      title: "products",
      path: "Product",
      products: product,
    });
  });
};
exports.getAdminProduct = (req, res, next) => {
  Product.find().then((product) => {
    res.render("admin/home", {
      title: "products",
      path: "/admin/Products",
      products: product,
    });
  });
};
exports.addProduct = (req, res, next) => {
  res.render("admin/add", {
    title: "Add product",
    path: "/admin/add",
  });
};
exports.postaddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    image: image,
    userId: req.user._id,
  });
  product.save().then((result) => {
    console.log(result);
    res.redirect("/admin");
  });
};
exports.deleteProduct = (req, res, next) => {
  const id = req.body.productId;
  Product.findByIdAndDelete(id).then((result) => {
    console.log("successful delete");
    res.redirect("/admin");
  });
};
exports.getupdateProduct = (req, res, next) => {
  const id = req.params.productId;
  console.log(id);
  Product.findById(id).then((product) => {
    console.log(product)
    res.render("admin/update", {
      title: "update product",
      path: "/admin/update",
      product: product,
    });
  });
};
exports.updateProduct=(req,res,next)=>{
  const id = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const image = req.body.image;
  const UpdateProduct = {
    title: title,
    price: price,
    description: description,
    image: image,
  };
  Product.findByIdAndUpdate(id, UpdateProduct,{new:true}).then(()=>{
     console.log("successful Update");
     res.redirect("/admin");
  })
}