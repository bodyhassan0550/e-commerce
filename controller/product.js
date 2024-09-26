const product = require("../models/product");
const Product = require("../models/product");
const User = require("../models/user");

exports.getProduct = (req, res, next) => {
  Product.find().then((product) => {
    res.render("product/home", {
      title: "products",
      path: "/Products",
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
    console.log(product);
    res.render("admin/update", {
      title: "update product",
      path: "/admin/update",
      product: product,
    });
  });
};
exports.updateProduct = (req, res, next) => {
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
  Product.findByIdAndUpdate(id, UpdateProduct, { new: true }).then(() => {
    console.log("successful Update");
    res.redirect("/admin");
  });
};

exports.getProductDetails = (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Product.findById(id).then((product) => {
    console.log(product);
    res.render("product/detalis", {
      title: product.title,
      path: "/details",
      product: product,
    });
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId") // Populate the productId field
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          product: item.productId,
          quantity: item.quantity,
        };
      });
      const cartTotal = products.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
      res.render("product/cart", {
        title: "Your Cart",
        cart: { items: products },
        cartTotal: cartTotal,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postAddCart = (req, res, next) => {
  const id = req.body.productId;

  // Find the product by ID
  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.redirect("/"); // Redirect if product does not exist
      }
      // Populate the user's cart items to get product details
      return req.user.populate("cart.items.productId").then(() => {
        return req.user; // Return the user after populating
      });
    })
    .then((user) => {
      const CartProductIndex = user.cart.items.findIndex((cb) => {
        return cb.productId._id.toString() === id.toString();
      });

      let newQuantity = 1;
      const updateCartItems = [...user.cart.items]; // Create a copy of cart items

      // Check if the product is already in the cart
      if (CartProductIndex >= 0) {
        newQuantity = user.cart.items[CartProductIndex].quantity + 1; // Increment quantity
        updateCartItems[CartProductIndex].quantity = newQuantity; // Update quantity
      } else {
        // Add new product to the cart
        updateCartItems.push({
          productId: id,
          quantity: newQuantity,
        });
      }

      // Update the user's cart
      user.cart.items = updateCartItems;
      return user.save(); // Save the updated user
    })
    .then((result) => {
      res.redirect("/cart"); // Redirect to the cart page
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/"); // Redirect in case of an error
    });
};
exports.postIncQuan = (req, res, next) => {
  const id = req.body.productId;
  // Populate the user's cart items to get product details
  req.user
    .populate("cart.items.productId")
    .then(() => {
      return req.user; // Return the user after populating
    })
    .then((user) => {
      const CartProductIndex = user.cart.items.findIndex((cb) => {
        return cb.productId._id.toString() === id.toString();
      });
      // Check if the product is already in the cart
      if (CartProductIndex >= 0) {
        user.cart.items[CartProductIndex].quantity += 1;
      }
      return user.save(); // Save the updated user
    })
    .then((result) => {
      res.redirect("/cart"); // Redirect to the cart page
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/"); // Redirect in case of an error
    });
};
exports.postDecQuan = (req, res, next) => {
  const id = req.body.productId;
  // Populate the user's cart items to get product details
  req.user
    .populate("cart.items.productId")
    .then(() => {
      return req.user; // Return the user after populating
    })
    .then((user) => {
      const CartProductIndex = user.cart.items.findIndex((cb) => {
        return cb.productId._id.toString() === id.toString();
      });
      // Check if the product is already in the cart
      if (CartProductIndex >= 0) {
        if (user.cart.items[CartProductIndex].quantity > 1) {
          user.cart.items[CartProductIndex].quantity -= 1;
        }
        else{
          user.cart.items.splice(CartProductIndex, 1);
        }
      }
      return user.save(); // Save the updated user
    })
    .then((result) => {
      res.redirect("/cart"); // Redirect to the cart page
    })
    .catch((err) => {
      console.error(err);
      res.redirect("/"); // Redirect in case of an error
    });
};
