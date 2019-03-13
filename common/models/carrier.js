'use strict';
const delivery = require("../lib/delivery.js");
const DeliveryFrame = require('../lib/delivery-frame');

module.exports = (Carrier) => {
  Carrier.getDelivery = function(id,fk,cb) {
    const Delivery = Carrier.app.models.delivery;
    const carrierId = id.split(".");
    
    delivery.getTrack[carrierId[0]][carrierId[1]](fk,(err,result) => {
      if(err){
        return cb(err,null);
      }
      
      // if(!result instanceof DeliveryFrame) cb(null,result);
      
      cb(null,result);
    });
  }

};
