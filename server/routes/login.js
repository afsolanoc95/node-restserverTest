const express = require('express');
const bcrypt = require('bcrypt');
//para el token de google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//

const Usuario = require(`../models/user`);
//para el token
const jwt = require('jsonwebtoken');


const app = express();




app.post('/login', (req, res) =>{
    let body= req.body;
    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "usuario y contraseña incorrectos"
                }
            });
        }
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "usuario y contraseña incorrectos"
                }
            });
        }
        
        //aplicando token
        let token=jwt.sign({
            usuario:usuarioDB
          }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});//expira en 30 dias


        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })
    })
});
//google config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
   // //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    return{
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
  }

app.post('/google',async (req, res) =>{
    let token= req.body.idtoken;
    let googleUser=await verify(token).catch(e=>{
        return res.status(403).json({
            ok:false,
            err:e
        })
    })
    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(usuarioDB){
            if(!usuarioDB.google){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: "debe usar su autenticacion normal"
                    }
                });
            }else{
                //se le actualiza o renueva el token personalizado
                let token=jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});//expira en 30 dias
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
            }
            
        }else{
            //si no existe en bd
            let usuario=new Usuario();
            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img;
            usuario.google=true;
            usuario.password=`:)`;
            usuario.save((err,usuarioDB)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }
                let token=jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});//expira en 30 dias
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
              });
        }
        
    })
    
    /*res.json({
        usuario:googleUser
    })*/
});


module.exports=app;