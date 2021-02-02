//declara constantes de forma global


//puerto
process.env.PORT=process.env.PORT || 3000;
//


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || `dev`;


//db
let urlDB;
if(process.env.NODE_ENV==`dev`){
    urlDB=`mongodb://localhost:27017/coffee`
}else{
   // urlDB=`mongodb+srv://admin:H2Z0lpjFjhtFzMz6@cluster0.ftxpi.mongodb.net/coffee?retryWrites=true&w=majority`
    urlDB=DB_URL;
}
//inventada
process.env.URLDB =urlDB;
