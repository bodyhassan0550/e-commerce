module.exports = (req, res, next) => {
  // Check if the user is logged in and is an admin
  if (!req.session.user || !req.session.user.IsAdmin) {
    return res.redirect("/login"); // Redirect to login if not an admin
  }

  // Proceed to the next middleware or route handler if the user is an admin
  next();
};
