'use strict';
const path = require('path');

function GeneralUser(User){
    User.getAllDelivery = function(id,nk,cb) {
        const mapping = User.app.models.DeliveryMapping;


        User.find({
            where:{email:id},
            include: {
                relation: 'deliveryMapping',
                scope: {
                    fields: ['delivery'],
                    include: {
                        relation: 'delivery',
                        scope: {
                            where: {carrierId: nk}
                        }
                    },
                }
                // deliveryMapping:'delivery',
                // scope:
            }
        },
        function(err,result) {
            console.log(result[0]);
            // console.log(result[0].toJSON().deliveryMapping);
            cb(null, {"msg":"test"});
        });

       
    }

    User.getDelivery = function(id,nk,fk,cb) {
        console.log(id);
        console.log(nk);
        console.log(fk);
        cb(null, {"msg":"test"});
    }
  
      
    
}


module.exports = GeneralUser;


