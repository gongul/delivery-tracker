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
            "arg": "invoicNumber",
            "type": "string",
            "description": "송장번호",
            "required": true
        }],
        description: "Delivery Tracking",
        returns: {type: 'Object',root: true},
        http: {
          "verb": "get",
          "path": "/:id/delivery/:invoicNumber"
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

    Carrier.afterRemote('getDelivery',(ctx,instance,next) => {
        const {id,invoicNumber} = ctx.args;
        const accessToken = ctx.req.accessToken;

        Carrier.emit('deliveryMapping',{id:id,invoicNumber:invoicNumber,accessToken:accessToken});

        return next();
    });

    Carrier.on('deliveryMapping',async function(info) {
        const {id,invoicNumber,accessToken} = info; 

        async function createDeliveryMapping(delivery){
            if(!accessToken) return;
        
            const data = await delivery.deliveryMapping.create({userEmail:accessToken.userId});

            return data;
        }   

        try{
            const hasDelivery = await Delivery.findOne({where:{invoicNumber:invoicNumber,carrierId:id}});  

            if(!hasDelivery) return;
            
            const hasDeliveryMapping = await hasDelivery.deliveryMapping.findOne({where:{userEmail:accessToken.userId}});
            if(!hasDeliveryMapping) await createDeliveryMapping(hasDelivery);

        }catch(e){
            console.log("유저 택배 송장번호 저장 실패");
        }
        
    });
}