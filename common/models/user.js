'use strict';
const path = require('path');
var moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");
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

    User.getDelivery = function(id,nk,invoicNumber,cb) {
        User.findOne({
            where:{email:id},
            include: {
                relation: 'deliveryMapping',
                scope: {
                    include: {
                        relation: 'delivery',
                        scope: {
                            fields: ['deliveryInfo'],
                            where: {carrierId: nk,invoicNumber:invoicNumber}
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


