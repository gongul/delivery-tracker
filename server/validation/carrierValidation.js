const config = require("../config.json");

module.exports = (app) => {
  // app.post(`${config.restApiRoot}/GeneralUsers/login`, function(req, res,next) {

  //   console.log(`${config.restApiRoot}/GeneralUsers/login`);
  //   const accessToken = app.models.AccessToken;
  //   accessToken.createAccessTokenId((err,token) => {
  //     console.log(token);

  //     accessToken.create({
  //       "id":token,
  //       "ttl":"10",
  //       "created":new Date(),
  //       "userId":"3"
  //     })

  //     return next();
  //   })

  //   // atoken.create()
    
  //   // token.create()
  // });

  app.use(function(req, res, next) {
    // Make sure this middleware is registered after loopback.token
    // console.log(app);
    return next();
  //   var token = req.accessToken;
  //   if (!token) {
  //       return next();
  //   }
  //   var now = new Date();
  //   if ( now.getTime() - token.created.getTime() < 1000 ) {
  //       return next();
  //   }
  //   req.accessToken.created = now;
  //   req.accessToken.ttl     = 604800; //one week
  //   req.accessToken.save(next);
  });

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
