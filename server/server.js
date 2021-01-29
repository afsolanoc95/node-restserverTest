require(`./config/config`);
const express = require('express')
const app = express()


//para los form-urlencoded  in soap ui colocar  el media type y marcar postquerystring y en parametros se mandan los atributos
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/user', function (req, res) {
  //res.send('Hello World')
  res.json('get Usuario');
});
//agregar data
app.post('/user', function (req, res) {
    //res.send('Hello World')
    let body=req.body;
    if(body.name==undefined){
        res.status(400).json({
            ok:false,
            mensaje: `nombre necesario`,
        });
    }else{
        res.json({
            persona:body
        });
    } 
});
//sirve mas para actualizar data el put
//el put por lo general se manda por el url
app.put('/user/:id', function (req, res) {
    let id=req.params.id;
    //res.send('Hello World')
    res.json({
        id
    });
});
app.delete('/user', function (req, res) {
    //res.send('Hello World')
    res.json('delete Usuario');
});


 
app.listen(process.env.PORT,()=>{
    console.log(`escuchando puerto ${process.env.PORT}`);
})