var express = require('express');
var router = express.Router();

router.get('/',(req,res,next) => {
    console.log("amdin");
    res.render('admin/index',{test:'user-list'});
});

module.exports = router;