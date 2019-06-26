const express = require("express");
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const router = express.Router();
const User = require("../../models/User");

// Route   ===>>>   GET api/auth
// Desc    ===>>>   Test route
// Access  ===>>>   Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/",
  [
    //VALIDATION WITH EXPRESS-VALIDATOR
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // GET USER INFO
      const { email, password } = req.body;

      // FIND IF USER ALREADY EXISTS
      let user = await User.findOne({ email });

      // IF USER EXISTS SEND AN ERROR
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // ENCRYPT PASSWORD
      var salt = await bcrypt.genSaltSync(10);
      user.password = await bcrypt.hashSync(password, salt);
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      await jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      // CATCH (IF ANY) ERRORS
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error ");
    }
  }
);

module.exports = router;
