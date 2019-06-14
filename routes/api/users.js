const express = require("express");
const { check, validationResult } = require("express-validator/check");

const router = express.Router();

// Route   ===>>>   POST api/users
// Desc    ===>>>   Test route
// Access  ===>>>   Public
router.get('/', (req,res)=>{
    res.send('Users route')
})



module.exports = router;
