const express = require('express');
const router = express.Router();

// Voice routes
router.post('/', (req, res ) => {
    const data = { ...req.body }
    console.log(data);
    // do something inteliigent
    res.send("Call completed");
});

router.get('/test', function(req, res){
    res.send("Test Successful")
});

module.exports =  router;
