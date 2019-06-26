const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator/check");
const router = express.Router();
const User = require("../../models/User");

// Route   ===>>>   POST api/users
// Desc    ===>>>   Test route
// Access  ===>>>   Public
router.get("/", (req, res) => {
  res.send("Users route");
});

// VALIDATE AND REGISTER USER
router.post(
  "/",
  [
    //VALIDATION WITH EXPRESS-VALIDATOR
    check("name", "Please enter username")
      .not()
      .isEmpty(),
    check("email", "Please enter an email").isEmail(),
    check("password", "Password must be atleast 6 characters or more").isLength(
      { min: 6 }
    )
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // GET USER INFO
      const { name, email, password } = req.body;

      // FIND IF USER ALREADY EXISTS
      let user = await User.findOne({ email });

      // IF USER EXISTS SEND AN ERROR
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // CHECK GRAVATAR PROFILE
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      // CREATE A NEW INSTANCE OF USER MODEL
      user = new User({
        name,
        email,
        password,
        avatar
      });

      // ENCRYPT PASSWORD
      var salt = await bcrypt.genSaltSync(10);
      user.password = await bcrypt.hashSync(password, salt);

      // SAVE IN DB
      await user.save();

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
