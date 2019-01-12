'use strict';
const http = require("../lib/axios.js");

module.exports = (Carrier) => {
  Carrier.getAllCarrier = (cb) => {
    Carrier.find({},(err,result) => {
      if(err){
        console.log(err);
      }
      
      cb(null,result);
    });
   
  }
  
  Carrier.getCarrier = (id,cb) => {
    Carrier.findOne({where:{id:id}},(err,result) => {
      if(err){
        console.log(err);
      }
      
      console.log(result);
      cb(null,result);
    });
  }

  Carrier.getDelivery = (id,trackId,cb) => {
    const carrierId = id.split(".");
    
    http.getTrack[carrierId[0]][carrierId[1]](trackId,(result) => {
      cb(null,result);
    });
  }

};
