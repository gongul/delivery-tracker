'use strict';
const http = require("../lib/delivery.js");

module.exports = (Carrier) => {
  // Carrier.getAllCarrier = (cb) => {
  //   Carrier.find({},(err,result) => {
  //     if(err){
  //       console.log(err);
  //     }
      
  //     cb(null,result);
  //   });
   
  // }
  
  // Carrier.getCarrier = (id,cb) => {
  //   Carrier.findOne({where:{id:id}},(err,result) => {
  //     if(err){
  //       console.log(err);
  //     }
      
  //     console.log(result);
  //     cb(null,result);
  //   });
  // }

  // Carrier.getDelivery = (id,trackId,cb) => {
  //   const carrierId = id.split(".");
    
  //   http.getTrack[carrierId[0]][carrierId[1]](trackId,(result) => {
  //     cb(null,result);
  //   });
  // }


  // "getAllCarrier": {
  //   "accepts": [],
  //   "returns": {
  //     "arg": "carrierList",
  //     "type": "string"
  //   },
  //   "http": {
  //     "verb": "get",
  //     "path": "/"
  //   }
  // },
  // "getCarrier": {
  //   "accepts": [
  //     {
  //       "arg": "id",
  //       "type": "string",
  //       "required": true
  //     }
  //   ],
  //   "returns": {
  //     "arg": "carrier",
  //     "type": "string"
  //   },
  //   "http": {
  //     "verb": "get",
  //     "path": "/:id"
  //   }
  // },
  // "getDelivery": {
  //   "accepts": [
  //     {
  //       "arg": "id",
  //       "type": "string",
  //       "required": true
  //     },
  //     {
  //       "arg": "trackId",
  //       "type": "string",
  //       "required": true
  //     }
  //   ],
  //   "returns": {
  //     "arg": "delivery",
  //     "type": "json"
  //   },
  //   "http": {
  //     "verb": "get",
  //     "path": "/:id/tracks/:trackId"
  //   }
  // }
};
