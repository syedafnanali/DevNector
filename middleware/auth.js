const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // GET THE TOKEN
  let token = req.header("x-auth-token");

  //   THROW ERROR IF NO TOKEN
  if (!token) {
    res.status(401).send({ msg: "No token, access denied " });
  }

  // VERIFY THE TOKEN
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();

  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
