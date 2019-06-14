const express = require('express');

const router = express.Router();

// Route   ===>>>   GET api/post
// Desc    ===>>>   Test route
// Access  ===>>>   Public


router.get("/", (req,res)=> console.log('Post route'));


module.exports = router;