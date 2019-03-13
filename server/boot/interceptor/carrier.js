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

    Carrier.afterRemote('getDelivery',async function(ctx,instance) {
        const {id,fk} = ctx.args; 

        async function createDeliveryMapping(delivery){
            if(!ctx.req.accessToken) return;
        
            const data = await delivery.deliveryMapping.create({userEmail:ctx.req.accessToken.userId});

            console.log("성공");
            return data;
        }   

        try{
            const hasDelivery = await Delivery.findOne({where:{invoicNumber:fk,carrierId:id}});  

            if(hasDelivery){
                const hasDeliveryMapping = await hasDelivery.deliveryMapping.findOne({});

                if(!hasDeliveryMapping) await createDeliveryMapping(hasDelivery);

                return;
            }

            const delivery = await Delivery.create({invoicNumber:fk,carrierId:id});
            const deliveryMapping = await createDeliveryMapping(delivery);

        }catch(e){
            console.log(e);
            console.log("유저 택배 송장번호 저장 실패");
        }

        // const err = new Errors.NotFoundError();

        // throw err;
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