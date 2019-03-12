module.exports = (app) => {
    app.get('/verified', function(req, res) {
        res.render('verified');
    });

    app.get('/reset-password', function(req, res, next) {
        if (!req.accessToken) return res.sendStatus(401);
        res.render('password-reset', {
          redirectUrl: '/api/users/reset-password?access_token='+
            req.accessToken.id
        });
    });
}