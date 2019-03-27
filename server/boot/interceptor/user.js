const Errors = require('../../../errors/errors');
var moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

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

    User.beforeRemote('**',(ctx,instance,next) => { // 필터 중에 regDate(endDate) 를 포함하는 검색 조건이 있을 시 endDate +1 하는 기능
        
        function validationDate(){
            const filter = ctx.args.filter;
            if(!filter) return false;
            else if(!filter.where) return false;
            else if(!filter.where.and) return false;
    
            const and = ctx.args.filter.where.and;
            let endDate;
    
            for(condition of and){
                if(condition['regdate'] != null && condition['regdate'] != undefined){
                    if(condition['regdate']['lt']){
                        endDate = new Date(condition['regdate']['lt']);
                        endDate.setDate(endDate.getDate()+1);
    
                        condition['regdate']['lt'] = endDate;
                    }
                }
            }

        }


        validationDate();

        // 이쪽 유저 권힌 체크 및 어드민이 아닐 시 role data 삭제
        return next();
    });

    User.afterRemote('prototype.patchAttributes',(ctx,instance,next) => {
        const Role = User.app.models.Role;
        const RoleMapping = User.app.models.RoleMapping;
        const roleValue = ctx.args.data.role;


        if(!roleValue) return next();
        
        const error = new Errors.InternalServerError();
        Role.findOne({where:{name:roleValue}},(err,result) => {
            if(err) return next(error);

            if(!result) return next(error);

            RoleMapping.updateAll({principalId: ctx.req.params.id},{roleId:result.id}, (err,info) => {
                if(err) return next(error);

                if(!info) return next();

                return next();
            })
        });
    });

    User.observe('before save', async function (ctx) { // 회원가입 시 회원가입 일 삽입
        const RoleMapping = User.app.models.RoleMapping;
        const Role = User.app.models.Role;
        

        async function validateRole(){
            const error = new Errors.InternalServerError();

            try{
                const hasRoleMapping = await RoleMapping.findOne({where:{principalId:ctx.where.email}});
                if(!hasRoleMapping) return false;
                
                const hasRole = await hasRoleMapping.role.get();
                if(!hasRole) return false;
                else if(hasRole.name != "admin") return false;

                return true
                
            }catch(e){
                return error;
            }

        }

        if(!ctx.isNewInstance){
            if(ctx.instance) delete ctx.instance.regdate;
            if(ctx.data) delete ctx.data.regdate;

            const result = await validateRole();

            if(result instanceof Error) return result;
            else if(!result) delete ctx.data.role;
            
            return;
        } 

        /* default role */
        ctx.instance.role = "user";
        
        var date = new Date().toISOString();
        ctx.instance.regdate = date;

        return true;
    });


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

        const e = new Errors.InternalServerError();

        CarrierMapping.create([
          {"userEmail":ctx.instance.id,"carrierId":"kr.cjlogistics"},
          {"userEmail":ctx.instance.id,"carrierId":"kr.epost"},
          {"userEmail":ctx.instance.id,"carrierId":"kr.hanjin"},
        ],(err,result) => {
            if(err) return next(e);

            if(ctx.instance.id == "user@user.com" || ctx.instance.id == "admin@admin.com") return next();

            const Role = app.models.Role;
            
            Role.findOne({where:{name:"user"}},(err,result) => {
                if(err) return next(e);
    
                result.principals.create({
                    principalType: "USER",
                    principalId: ctx.instance.id
                },(err,result) => {
                    if(err) return next(e);
                })
            })

            return next();
        });

      
       

     
    });
}