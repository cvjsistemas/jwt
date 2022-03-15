require('dotenv').config(); //inicia el paquete de dotenvPath

const express = require('express');

const cookieParser = require("cookie-parser");

const PORT = process.env.PORT ||3000;

const app=express();


app.set('view engine','ejs');

app.use(express.urlencoded({extended: false}));// para enviar por body
app.use(express.json());
app.use(express.static('public')) //setea los archivos  de la carpeta public


app.use(cookieParser());
//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use('/',require('./routes/router'));

//Para eliminar la cache 
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

app.listen(PORT,()=>{
    console.log(`Servidor UP en el puerto: ${PORT}`);
});
