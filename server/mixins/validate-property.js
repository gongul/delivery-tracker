
const Errors = require('../../errors/errors');

module.exports = function(Model, options) {
    // Model.prototype.toJSON = function(){ // get 
    //     console.log("proto");
    //     const modelName = ctx.Model.modelName;
    //     const AffectedModel = Model.app.models[modelName];
    //     let properties = [];
    //     let validationData = {};


    //     AffectedModel.forEachProperty((data) => {  
    //         properties.push(data);
    //     })

    //     var obj = this.toObject(false, true, false);
    //     var json = {};
    //     for(var p in obj) {
    //         if(properties.indexOf(p) === -1) continue;
    //         json[p] = obj[p];
    //     }

    //     return json;
    // }

    Model.beforeRemote('**', function(ctx, instance, next) {  // 필터 사용 시 어드민 권한이 없으면 사용 못하게 삭제 하는 작업 
        const roleMapping = Model.app.models.RoleMapping;

        function filterDelete(){
            if(ctx.args.filter) delete ctx.args.filter;
            
            return next();
        }

        if(!ctx.req.accessToken){
            return filterDelete();
        }

        const err = new Errors.InternalServerError();
        
        roleMapping.findOne({where:{principalId:ctx.req.accessToken.userId}},(err1,result) => {
            if(err1) return next(err);

            if(!result) return filterDelete();

            result.role.get().then((role) => {
                if(!role)  return filterDelete();

                if(role.name != "admin"){
                    return filterDelete();
                }

                return next();
            })
         
        });

        
    });

    Model.observe('before save', function(ctx, next) { // 디비 수정 or 저장 시 모델 프로퍼티랑 다른 데이터가 들어오면 걸러내는 작업
        const modelName = ctx.Model.modelName;
        const AffectedModel = Model.app.models[modelName];
        const instanceProperties = Object.keys(ctx.instance.__data);
        let properties = [];

        AffectedModel.forEachProperty((data) => {  
            properties.push(data);
        })

        for(const key of instanceProperties){

            const isAllowProperty = properties.indexOf(key);

            if(isAllowProperty == -1){
                ctx.instance.unsetAttribute(key);
            }
        }

        return next();
    });
  };
  