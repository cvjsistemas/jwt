const mysql = require('mysql');

const conexion =mysql.createConnection({
    host: process.env.DB_HOST ,
    user:process.env.DB_USER || 'root',
    password:process.env.DB_PASS,
    database:process.env.DB_DATABASE || 'loginjwt'
})

conexion.connect((err)=>{
    if(err){
        console.error('error connecting: ' + err.stack);
        return;
    } else{
        console.log('Conectado a Mysql');
    }
})


module.exports = conexion;