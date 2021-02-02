const mongoose = require('mongoose');
//constante para hacer friend los ingresos repetidos a datos unicos para que no repita datos en la db
var uniqueValidator = require('mongoose-unique-validator');

//para que acepte solo un valor u otro
let rolesValidos={
    values:[`ADMIN_ROLE`,`USER_ROLE`],
    message: `{VALUE} no es un rol valido`
};



let Schema=mongoose.Schema;
let userSchema= new Schema({
    nombre:{
        type: String,
        required:[true,`el nombre es necesario`]
    },
    email:{
        type: String,
        unique: true,
        required:[true,`el email es necesario`]
    },
    password:{
        type: String,
        required:[true,`el password es necesario`]
    },
    img:{
        type: String
    },
    role: {
        type: String,
        default: `USER_ROLE`,
        enum: rolesValidos
    },
    estado: {
        type:Boolean,
        default: true
    },
    google: {
        type:Boolean,
        default: false
    }
});
//para que no muestre el password en el response
//no usar ()=> debido a que se usara el this
userSchema.methods.toJSON=function(){
    let user =this;
    let userObject=user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin(uniqueValidator,{message:'{PATH} debe ser unico'});



module.exports=mongoose.model(`Usuarios`,userSchema)