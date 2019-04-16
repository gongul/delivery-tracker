const Errors = require('../../../errors/errors');

module.exports = (app) => {
    app.use('/admin',(req,res,next) => {
        const err = new Error("Cannot GET "+req.originalUrl);
        err.status = "404";

        if(req.accessToken) {
            res.cookie('authorization',req.accessToken.id,{
                signed: true,
                maxAge: 100000000,
            })
        }
        // if(!req.accessToken) return next(err);

        // const roleMapping = app.models.RoleMapping;

        // roleMapping.findOne({where:{principalId:req.accessToken.userId}},(err1,result) => {
        //     if(err1) return next(err);

        //     if(!result) return next(err);

        //     result.role.get().then((role) => {
        //         if(!role) return next(err);

                return next();
        //     })
         
        // });
    })
}