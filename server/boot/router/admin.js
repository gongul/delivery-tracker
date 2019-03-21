var express = require('express');
var router = express.Router();

router.get('/test',(req,res,next) => {
    

    res.json({"msg":"test"});
});

router.get('/',(req,res,next) => {
    res.cookie('authorization',"CCYAfRV8NiV4xQrjSEkGwR5pCdEnlgKGaqdbNlQ2tnyHKf7gYdATk8QvM0jNZh8p",{
        signed: true,
        maxAge: 100000,
    })

    res.render('admin/index',{
        accessToken: req.accessToken,
        test:'user-list'
    });
});

module.exports = router;