module.exports = (app) => {
    const User = app.models.user;
    const CarrierMapping = app.models.CarrierMapping;

    User.observe('after save',(ctx, next) => {
        CarrierMapping.create([
          {"userId":ctx.instance.id,"carrierId":"kr.cjlogistics"},
          {"userId":ctx.instance.id,"carrierId":"kr.epost"},
          {"userId":ctx.instance.id,"carrierId":"kr.hanjin"},
        ])

        next();
    });
}