const config = require("../config.json");

module.exports = (app) => {
  app.use(`${config.restApiRoot}/carriers/:id/tracks/`,(req,res,next) => {
    const carrier = app.models.carrier;
    const { id } = req.params;
    
    
    carrier.find({where:{id:id}},(err,result) => {
      if(err){
        throw err;
      }

      if(result.length == 0){
        return res.json({delivery:"해당 택배사는 존재하지 않습니다."});
      }
  
      
      next();
    });
  });
}
