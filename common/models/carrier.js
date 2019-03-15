'use strict';
const track = require("../../lib/custom/delivery");
const DeliveryFrame = require('../../lib/custom/delivery-frame');

module.exports = (Carrier) => {
  Carrier.getDelivery = async function(id,invoicNumber) {
    const DeliveryModel = Carrier.app.models.delivery;
    const carrierId = id.split(".");
    
    try{
      const result = await track.getTrack[carrierId[0]][carrierId[1]](invoicNumber);
      
      if(result instanceof DeliveryFrame){
        const delivery = result.getDelivery();

        await DeliveryModel.upsertWithWhere({carrierId:id,invoicNumber:invoicNumber},{carrierId:id,invoicNumber:invoicNumber,deliveryInfo:JSON.stringify(delivery),finnalState:delivery.deliveryInfo.finalState});
      
        return delivery;
      } 
      
      return result;
     
    }catch(e){
      throw e;
    }
    
  }

};
