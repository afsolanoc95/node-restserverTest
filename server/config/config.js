//declara constantes de forma global


//puerto
process.env.PORT=process.env.PORT || 3000;
//


//entorno
process.env.NODE_ENV = process.env.NODE_ENV || `dev`;


//vencimiento token   30 dias
process.env.CADUCIDAD_TOKEN =60 * 60 * 24 * 30;

//seed-  semilla autenticacion

process.env.SEED= process.env.SEED || 'this_secret_developer';



//db
let urlDB;
if(process.env.NODE_ENV==`dev`){
    urlDB=`mongodb://localhost:27017/coffee`
}else{
    urlDB=process.env.DB_URL;
}
//inventada
process.env.URLDB =urlDB;


//google client id


process.env.CLIENT_ID = process.env.CLIENT_ID || `150870869846-vit5eess8l05o32qgom3em9tpsiqmcrq.apps.googleusercontent.com`