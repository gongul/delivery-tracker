module.exports = (app) => {
    const admin = require('./admin');

    app.use('/admin',admin);
    
    app.get('/verified', function(req, res) {
        res.render('verified');
    });


    app.get('/socket', function(req, res) {
        res.render('socket');
    });

    app.get('/reset-password', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);
        res.render('password-reset', {
          redirectUrl: '/api/users/reset-password?access_token='+
            req.accessToken.id
        });
    });
}