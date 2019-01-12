const schema = require('../../common/models/carrier.json');

module.exports = (app) => {
  const carrier = app.models.carrier;

  carrier.create([{id:"kr.cjlogistics",name:"CJ 택배",tel:"1588-1255"},{id:"kr.epost",name:"우체국 택배",tel:"1588-1300"}],(err,obj) => {
    if(err){
      console.log(err);
    }

    console.log(obj);
  })
  // carrier.find({where: {id: 'kr.cjlogistics '}, limit: 1},(err,result) => {
  //     if(err){
  //       console.log(err);
  //     }
      
  //     console.log(result);
  //     next();
  //   });
  // ds.isActual(schema.name, function(err, actual) {
  //   if(err){
  //     // console.log(err);
  //   }
  //   if (!actual) {
  //     ds.autoupdate(schema.name, function(err, result) {
  //       if(err){
  //         // console.log(err);
  //       }
  //       // console.log("-------");
  //       // console.log(result);
  //       ds.discoverModelProperties(schema.name, function (err, props) {
  //         // console.log(props);
  //       });
  //     });
  //   }
  // });
}

