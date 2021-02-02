//verificar token

const jwt=require(`jsonwebtoken`);

//next continua con la ejecuion del programa
let verificaToken=(req,res,next)=>{
    let token=req.get(`Authorization`);
    //obtenemos la info del token
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: `token no valido`
                }
            });
        }
        req.usuario=decoded.usuario;
        next();
    })  
};

//verifica rol admin

let verificaAdmin=(req,res,next)=>{
    let usuario=req.usuario;
    
    //obtenemos la info del token
   if(usuario.role==`USER_ROLE`){
    return res.json({
        ok:false,
        err:{
            message: `role no valido`
        }
    });
   }else{
        next();
   }
   
};


module.exports={
    verificaToken,
    verificaAdmin
}