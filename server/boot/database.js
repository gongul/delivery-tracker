const schema = require('../../common/models/carrier.json');
var moment = require('moment');
require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

module.exports = async (app) => {
  const Carrier = app.models.carrier;
  const User = app.models.user;
  const Role = app.models.Role;
  const RoleMapping = app.models.RoleMapping;
  
  const result = await Carrier.count();

  if(result !== 0) return;
  
  Carrier.create([
    {id:"kr.cjlogistics",name:"CJ 택배",tel:"1588-1255"},
    {id:"kr.epost",name:"우체국 택배",tel:"1588-1300"},
    {id:"kr.hanjin",name:"한진 택배",tel:"1588-0011"}
  ],(err,carriers) => {
    if (err) throw err;

    console.log("택배사 등록 완료.");
    console.log(carriers);
   
  });

  var date = new Date().toISOString();

  User.create([
    {"email":"admin@admin.com","username":"admin","tel":"xxxx-xxxx","password":"admin","emailVerified":true,"regdate":date},
    {"email":"user@user.com","username":"user","tel":"xxxx-xxxx","password":"user","emailVerified":true,"regdate":date}
  ], function(err, users) {
    if (err) throw err;

      
    console.log("유저 생성 완료.");
    console.log(users);
    
    Role.create({
      name: 'user'
    },(err, role) => {
      if(err) throw err;

      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[1].id
      },(err, principal) => {
        if (err) throw err;

        console.log("일반 유저 등록 완료.");
      });
    });

    Role.create({
      name: 'admin'
    }, (err, role) => {
      if (err) throw err;
  
      console.log("권한 어드민 생성 완료.");
      
      role.principals.create({
        principalType: RoleMapping.USER,
        principalId: users[0].id
      },(err, principal) => {
        if (err) throw err;

        console.log("어드민 유저 둥록 완료.");
      });
    });

  });

}

