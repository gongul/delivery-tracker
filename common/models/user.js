'use strict';
const path = require('path');

function GeneralUser(User){
    User.getAllDelivery = function(id,nk,cb) {
        User.findOne({
            where:{email:id},
            include: {
                relation: 'deliveryMapping',
                scope: {
                    include: {
                        relation: 'delivery',
                        scope: {
                            fields: ['deliveryInfo'],
                            where: {carrierId: nk}
                        }
                    },
                }
            }
        },(err,result) => {
            if(err) return cb(err,null);
            
            let list = [];
            result.toJSON().deliveryMapping.forEach((mapping) => {
                if(!mapping.delivery) return true;
                
                list.push(JSON.parse(mapping.delivery.deliveryInfo));
            }); 

            cb(null, list);
        });
       
    }

    User.getDelivery = function(id,nk,fk,cb) {
        User.findOne({
            where:{email:id},
            include: {
                relation: 'deliveryMapping',
                scope: {
                    include: {
                        relation: 'delivery',
                        scope: {
                            fields: ['deliveryInfo'],
                            where: {carrierId: nk,invoicNumber:fk}
                        }
                    },
                }
            }
        },(err,result) => {
            if(err) return cb(err,null);

            let list = [];
            result.toJSON().deliveryMapping.forEach((mapping) => {
                if(!mapping.delivery) return true;
                
                list.push(JSON.parse(mapping.delivery.deliveryInfo));
            }); 

            cb(null, list);
        });
    }
  
      
    
}


module.exports = GeneralUser;


