//https://afsolanoc-webserve.herokuapp.com/
require(`./config/config`);
const express = require('express');
const mongoose = require('mongoose');
const path=require(`path`);

const app = express();


//para los form-urlencoded  in soap ui colocar  el media type y marcar postquerystring y en parametros se mandan los atributos
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//habilitar public
app.use(express.static(path.resolve(__dirname,`../public`)));


app.use(require(`./routes/index`));


/*
try{
    await mongoose.connect('mongodb://localhost:27017/my_database', {
        useNewUrlParser: true
    });
}catch(err){
    handleError(error);
}*/
mongoose.connect(process.env.URLDB, { 
    useNewUrlParser: true ,
    useUnifiedTopology: true,
   // useFindAndModify: false,
    useCreateIndex: true
}).then(console.log("db online ")).catch(error => handleError(error));




 
app.listen(process.env.PORT,()=>{
    console.log(`escuchando puerto ${process.env.PORT}`);
})