'use strict';
const delivery = require("../lib/delivery.js");

module.exports = (Carrier) => {
  Carrier.getDelivery = function(id,fk,cb) {
    const carrierId = id.split(".");
    
    delivery.getTrack[carrierId[0]][carrierId[1]](fk,(err,result) => {
      if(err){
        return cb(err,null);
      }
      
      cb(null,result);
    });
  }

};
