const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_CODE, (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.redirect("/users/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/users/login");
  }
};


