const express = require('express');

const router = express.Router();

// Route   ===>>>   GET api/profile
// Desc    ===>>>   Test route
// Access  ===>>>   Public


router.get("/", (req,res)=> console.log('Profile route'));


module.exports = router;