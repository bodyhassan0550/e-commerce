const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser")
const path = require("path");
const session= require("express-session")
const User = require("./models/user")

const UserRouter = require("./router/User")
const ProductRouter = require("./router/admin")
const app = express();

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");
const mongodbStore=require("connect-mongodb-session")(session)
const mongooseUrl =
  "mongodb+srv://bodyhassan0550:body312002%40@cluster0.i6vca26.mongodb.net/e-commerce";


const store = new mongodbStore({
  uri: mongooseUrl,
  collection: "session",
});

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next(); // Add return to prevent further execution
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next(); // User not found, move to the next middleware
      }
      req.user = user; // Attach user object to the request
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});
app.use((req, res, next) => {
  res.locals.isloggedin = req.session.isloggedin;
  next();
});
app.use(UserRouter)
app.use(ProductRouter);

mongoose.connect(mongooseUrl).then(()=>{
    console.log("connect");
    app.listen(3000)
})