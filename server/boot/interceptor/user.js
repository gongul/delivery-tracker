module.exports = (app) => {
    const User = app.models.user;
    const CarrierMapping = app.models.CarrierMapping;

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

    User.observe('after save',(ctx, next) => {
        CarrierMapping.create([
          {"userEmail":ctx.instance.id,"carrierId":"kr.cjlogistics"},
          {"userEmail":ctx.instance.id,"carrierId":"kr.epost"},
          {"userEmail":ctx.instance.id,"carrierId":"kr.hanjin"},
        ])

        next();
    });
}