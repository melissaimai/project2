// middleware/route-guard.js

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (!req.session.User) {
    return res.redirect("/login");
  }
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the dashboard page
const isLoggedOut = (req, res, next) => {
  if (req.session.User) {
    return res.redirect("/dashboard");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
