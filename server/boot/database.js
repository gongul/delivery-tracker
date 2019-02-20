const schema = require('../../common/models/carrier.json');

module.exports = (app) => {
  const carrier = app.models.carrier;

  var User = app.models.GGG;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;


  // Role.create({
  //   name: 'admin'
  // }, (err, role) => {
  //   if (err) throw err;

  //   role.principals.create({
  //     principalType: RoleMapping.USER,
  //     principalId: "1"
  //   },(err, principal) => {
  //     if (err) throw err;

  //     console.log("Admin 등록 완료.");
  //   });
  // });


  // User.create([
  //   {"email":"admin@admin.com","name":"admin","tel":"xxxx-xxxx","password":"admin"}
  // ], function(err, users) {
  //   if (err) throw err;

  //   users[0].carriers.create([
  //     {id:"kr.cjlogistics",name:"CJ 택배",tel:"1588-1255"},
  //     {id:"kr.epost",name:"우체국 택배",tel:"1588-1300"},
  //     {id:"kr.hanjin",name:"한진 택배",tel:"1588-0011"}
  //   ],(err,obj) => {
  //     if (err) throw err;

  //     console.log(obj)
  //   })
  // });

}

