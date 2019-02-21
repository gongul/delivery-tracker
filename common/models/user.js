'use strict';

function GeneralUser(User){
    
    // User.observe('after save',(ctx, next) => {
    //     console.log(ctx);
    //     next();
    // })
    // User.beforeRemote('login',(ctx,instance,next) => {
    //     const credentials = ctx.args.credentials;

    //    if(!isCredential(credentials)) return next();

    //     User.findOne({where:{"email":credentials.email}},(err,result) => {
    //         if(err) return next(err);

    //         if(!result) return next();

    //         result.hasPassword(credentials.password, function(err, isMatch) {
    //             if(err) return next(err);

                
    //             if(isMatch){
    //                 ctx.args.credentials.email = result.email;

    //                 return next();
    //             }
    //         });
            
    //     })
        
    // });

    // const isCredential = (credentials) => {
    //     if(Object.keys(credentials).length === 0){
    //         return false;
    //     }else if (credentials.email == undefined){
    //         return false;
    //     }else if (credentials.password == undefined){
    //         return false;
    //     }

    //     return true;
    // }
}


module.exports = GeneralUser;


