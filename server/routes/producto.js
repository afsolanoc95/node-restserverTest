const express = require('express');
let {verificaToken}=require(`../middlewares/authenticacion`)
let Producto=require(`../models/producto`)

const app = express();

app.get(`/producto`,verificaToken,(req,res)=>{
    let desde= req.query.desde || 0;
    desde = Number(desde);
    Producto.find({disponible:true})
    .skip(desde)
    .limit(5)
    .populate(`usuario`,`nombre email`)
    .populate(`categoria`,`descripcion`)
    .exec((err,productos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            }); 
        }
        res.json({
            ok:false,
            productos
        });
    });
//con populate saco la informacion del que solicita la operacion  usuario es el nombre de la coleccion
//segundo argumento los valores del esquema usuario
//sort es ordene segun criterio
})

app.get(`/producto/:id`,verificaToken,(req,res)=>{
    let id=req.params.id;
    Producto.findById(id)
    .populate(`usuario`,`nombre email`)
    .populate(`categoria`,`descripcion`)
    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            }); 
        }
        if(!productoDB){
            return res.status(500).json({
                ok:false,
                err:{
                    message:`id no es correcto`
                }
            }); 
        }
        res.json({
            ok:false,
            producto:productoDB
        });
    })
    
});

app.put(`/producto/:id`,verificaToken,(req,res)=>{
    let id=req.params.id;
    let body=req.body;
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            }); 
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:`el id no existe`
                }
            }); 
        }
        productoDB.nombre=body.nombre;
        productoDB.precioUni=body.precioUni;
        productoDB.categoria=body.categoria;
        productoDB.disponible=body.disponible;
        productoDB.descripcion=body.descripcion;
        productoDB.save((err,productoguardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                }); 
            }
            res.json({
                ok: true,
                producto:productoguardado
            });
        })
      });
});


//buscar productos
app.get(`/producto/buscar/:termino`,verificaToken,(req,res)=>{
    let termino=req.params.termino;
    //expresion regular sirve para busquedas encuentra lo que mas se paresca
   //la i es insensible mayusculas y minusculas
    let regex=new RegExp(termino,`i`);
    Producto.find({nombre:regex})
    .populate(`categoria`,`nombre`)
    .exec((err,productos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            }); 
        }
        res.json({
            ok: true,
            productos
        });
    })
});





app.post(`/producto`,verificaToken,(req,res)=>{
   
    let body=req.body;
    let producto=new Producto({
        usuario:req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
    });
    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            }); 
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"no existe"
                }
            }); 
        }
        res.json({
            ok:true,
            producto:productoDB
        });
    });

});

app.delete(`/producto/:id`,verificaToken,(req,res)=>{
    let id= req.params.id;
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            }); 
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:"id no existe"
                }
            }); 
        }
        productoDB.disponible=false;
        productoDB.save((err,productoEliminado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                }); 
            }
            res.json({
                ok:true,
                producto:productoEliminado,
                message: `producto borrado`
            })
        })
       
    });

});

module.exports =app;