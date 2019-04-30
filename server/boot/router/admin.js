var express = require('express');
var router = express.Router();

router.get('/test',(req,res,next) => {
    

    res.json({"msg":"test"});
});

router.get('/',(req,res,next) => {
    res.redirect('/admin/user-list?access_token='+req.accessToken.id);
});

router.get('/user-list',(req,res,next) => {
    res.render('admin/index',{
        accessToken: req.accessToken,
        contents:'user/user-list',
        nav:'userList'
    });
});

router.get('/register-user',(req,res,next) => {
    res.render('admin/index',{
        accessToken: req.accessToken,
        contents:'user/register-user',
        nav:'registerUser'
    });
});



router.get('/carrier-list',(req,res,next) => {
    res.render('admin/index',{
        accessToken: req.accessToken,
        contents:'user/carrier-list',
        nav:'carrierList'
    });
});

module.exports = router;