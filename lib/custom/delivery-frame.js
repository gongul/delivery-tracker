var DeliveryFrame = function(){
    this._delivery = {};

    this._$init.apply(this,arguments);
}

DeliveryFrame.prototype = {
    _$init : function(delivery = {}){
        if(delivery.constructor !== Object) return;

        this._delivery = delivery;
    },

    setDelivery : function(delivery){
        this._delivery = delivery;
        return this;
    },

    getDelivery : function(){
        return this._delivery;
    }
}

module.exports = DeliveryFrame;