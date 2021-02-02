const express = require('express');
//para encriptar password bycrypt   
const bcrypt = require('bcrypt');
//
//underscore para put actualizar pero que actualicen siguiendo el encriptado
const _=require(`underscore`);
const Usuario = require(`../models/user`);
const {verificaToken,verificaAdmin}=require(`../middlewares/authenticacion`);
const app = express();


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJBRE1JTl9ST0xFIiwiZXN0YWRvIjp0cnVlLCJnb29nbGUiOmZhbHNlLCJfaWQiOiI2MDE1ZTM0MDIwZjhhZDJhMDgzYTVhMmIiLCJub21icmUiOiJjYXJsaXRvcyIsImVtYWlsIjoiYWZzbGFub2M5NUBnbWFpbC5jb20iLCJfX3YiOjB9LCJpYXQiOjE2MTIzMDIzMjMsImV4cCI6MTYxMjMwNDkxNX0.bTdisk9U8dvRu9BFZz4JaVKelF6ZaDofZ0DqfjxS_Wc

//si quiero usar el token, usar middleware el cual va de segundo argumento

app.get('/user',verificaToken ,(req, res) =>{

    //obtener lo del verificatoken
    /*return res.json({
        usuario:req.usuario
    })*/


    //res.send('Hello World')
   // res.json('get Usuario local');
   //http://localhost:3000//user?desde=10
   //H2Z0lpjFjhtFzMz6  user:admin
    let desde=req.query.desde || 0;
    let limite=req.query.limite || 5;
    //find para el filtro
   Usuario.find({estado:true},`nombre email role google`)
   .skip(Number(desde))
   .limit(Number(limite))
   .exec((err,usuarios)=>{
    if(err){
        return res.status(400).json({
            ok:false,
            err
        }); 
    }
    Usuario.countDocuments({estado:true},(err,conteo)=>{
        res.json({
            ok:false,
            usuarios,
            cuantos:conteo
        });
    });
   });
});
  //agregar data
  app.post('/user',[verificaToken,verificaAdmin], function (req, res) {
      //res.send('Hello World')
      let body=req.body;
      let usuario=new Usuario({
        nombre:body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        //img: body.img
        role:body.role
      });
      usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        //usuarioDB.password=null;
        res.json({
            ok:true,
            usuario:usuarioDB
        });
      });
  });
  //sirve mas para actualizar data el put
  //el put por lo general se manda por el url
  app.put('/user/:id',[verificaToken,verificaAdmin], function (req, res) {
      let id=req.params.id;
     
     
     // let body=req.body;
    //para underscore
    let body= _.pick(req.body,[`nombre`,`email`,`img`,`role`,`estado`]);
    //
      //delete body.google;
      //runvalidator es para que tome las validaciones del esquema como por ejempl oque oslo tome dos valores espcificos en la db
      Usuario.findByIdAndUpdate(id,body,{new:true, runValidators:true},(err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok: true,
            usuario:usuarioDB
        })
      });
      
  });
  app.delete('/user',[verificaToken,verificaAdmin], function (req, res) {
      //res.send('Hello World')
     // res.json('delete Usuario');
   /*  eliminacion fisica
   let id=req.query.id;
     Usuario.findByIdAndRemove(id,(err,eliminado)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };
        if(!eliminado){
            return res.status(400).json({
                ok:false,
                err:{
                    message: `usuario no encontrado`
                }
            });
        }
        res.json({
            ok:true,
            usuario:eliminado
        })
     })*/
     let id=req.query.id;
     let estado=req.body.estado=false;
     Usuario.findByIdAndUpdate(id,{estado},{new:true},(err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.json({
            ok: true,
            usuario:usuarioDB
        })
      });
  });
  module.exports=app;