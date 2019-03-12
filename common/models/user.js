'use strict';
const path = require('path');

function GeneralUser(User){
    User.getAllDelivery = function(id,nk,cb) {

      
        cb(null, {"msg":"test"});
    }

    User.getDelivery = function(id,nk,fk,cb) {
        console.log(id);
        console.log(nk);
        console.log(fk);
        cb(null, {"msg":"test"});
    }
  
      
    
}


module.exports = GeneralUser;


