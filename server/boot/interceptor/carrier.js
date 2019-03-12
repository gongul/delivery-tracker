const Errors = require('../../../common/errors/errors');

module.exports = (app) => {
    const Carrier = app.models.carrier;
    const Delivery = app.models.delivery;

    Carrier.remoteMethod('getDelivery', {
        accepts: [
        {   
            "arg": "id",
            "type": "string",
            "description": "carrier id",
            "required": true
        },
        {
            "arg": "fk",
            "type": "string",
            "description": "delivery의 외부키",
            "required": true
        }],
        description: "Delivery Tracking",
        returns: {type: 'Object',root: true},
        http: {
          "verb": "get",
          "path": "/:id/delivery/:fk"
        }
    });



    Carrier.beforeRemote('getDelivery',(ctx,instance,next) => {
        let hasCarrier = false; 
        
        Carrier.find({},(err,carriers) => {
            if(err) return next(err);

            for(const carrier of carriers){
                if(ctx.args.id === carrier.id) hasCarrier = true;
            }

            if(hasCarrier == false){
                const customErr = new Errors.NotFoundError(`알 수 없는 carrier id ${ctx.args.id}`);
                customErr.code = "MODEL_NOT_FOUND";

                return next(customErr);
            }

            next();
        });
    });

    Carrier.afterRemote('getDelivery',function(ctx,instance,next) {
        const {id,fk} = ctx.args; 

        if(!ctx.req.accessToken) return next();
        
        // Delivery.findOne({where:{invoicNumber:fk,carrierId:id}},(err,delivery) => {
        //     if(err) return next(err);

        //     if(delivery) return next();
 
        //     Delivery.create({invoicNumber:fk,carrierId:id},(err,result) => {
        //         if(err) return next();

        //         result.deliveryuser.create({id:fk,userEmail:ctx.req.accessToken.userId},(err,re) => {
        //             console.log(err);
        //             console.log(re);


        //             re.deliveryuser.findById(fk,(err,fi) => {
        //                 console.log(fi);

        //                 return next();
        //             })
                    
        //         });

        //     })
        // });
        
    });
}