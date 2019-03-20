const Errors = require('../../../errors/errors');

module.exports = (app) => {
    const User = app.models.user;
    const Carrier = app.models.carrier;
    const CarrierMapping = app.models.CarrierMapping;

   
    User.remoteMethod('getAllDelivery', {
        accepts: [
            {
                "arg": "id",
                "type": "string",
                "required": true
            },
            {
                "arg": "nk",
                "type": "string",
                "required": true
            }
        ],
        description: "All invoice number searched by the user",
        returns: {type: 'Object',root: true},
        http: {
            "verb": "get",
            "path": "/:id/carriers/:nk/delivery"
        }
    })

    User.remoteMethod('getDelivery', {
        accepts: [
            {
                "arg": "id",
                "type": "string",
                "required": true
            },
            {
                "arg": "nk",
                "type": "string",
                "required": true
            },
            {
                "arg": "invoicNumber",
                "type": "string",
                "required": true
            }
        ],
        description: "Invoice number searched by the user",
        returns: {type: 'Object',root: true},
        http: {
            "verb": "get",
            "path": "/:id/carriers/:nk/delivery/:invoicNumber"
        }
    })

    const _deliveryValidate = (info,next) => {
        const { id } = info;
        let hasUser = false; 
        
        User.find({},(err,users) => {
            if(err) return next(err);

            for(const user of users){
                if(id === user.id) hasUser = true;
            }

            if(hasUser == false){
                const customErr = new Errors.NotFoundError(`알 수 없는 user id ${id}`);
                customErr.code = "MODEL_NOT_FOUND";

                return next(customErr);
            }

            next();
        });
    }   

    User.beforeRemote('getDelivery',(ctx,instance,next) => {
       _deliveryValidate(ctx.args,next);
    });

    User.beforeRemote('getAllDelivery',(ctx,instance,next) => {
        _deliveryValidate(ctx.args,next);
     });

    User.afterRemote('create', function(context, userInstance, next) {
        var options = {
            type: 'email',
            to: userInstance.email,
            from: 'projectgongul@gmail.com',
            subject: 'Thanks for registering.',
            redirect: '/verified',
            restApiRoot: "/api",
            user: User
        };


        userInstance.verify(options, function(err, response) {
            if (err) return next(err);

            context.res.json({"message":"Please check your email and click on the verification link before logging in"});
        });
    });

    User.afterRemote('prototype.verify', function(context, user, next) {
        context.res.json({"message":"Please check your email and click on the verification link before logging in"});
    });

    User.afterRemote('resetPassword', function(context, user, next) {
        context.res.json({"message":"Please check your email"});
    });

    User.on('resetPasswordRequest', function(info) {
        var url = 'http://' + '0.0.0.0' + ':' + '3000' + '/reset-password';
        var html = 'Click <a href="' + url + '?access_token=' +
            info.accessToken.id + '">here</a> to reset your password';

        User.app.models.Email.send({
            to: info.email,
            from: 'projectgongul@gmail.com',
            subject: 'Password reset',
            html: html
        }, function(err) {
            if (err) return console.log('> error sending password reset email');
            console.log('> sending password reset email to:', info.email);
        });
    });

    User.observe('after save',(ctx, next) => {
        if(!ctx.isNewInstance) return next();

        CarrierMapping.create([
          {"userEmail":ctx.instance.id,"carrierId":"kr.cjlogistics"},
          {"userEmail":ctx.instance.id,"carrierId":"kr.epost"},
          {"userEmail":ctx.instance.id,"carrierId":"kr.hanjin"},
        ])

        next();
    });
}