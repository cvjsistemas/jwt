const jwt = require('jsonwebtoken');
const conexion = require('../database/db');
const Swal = require('sweetalert2');
//var config = require('../config');

const authrol = (req, res, next) => {

    const cookie =  req.cookies.access_token;


   

    if (cookie){

        const token = cookie.split('=').pop();
   
        try {
            const data = jwt.verify(token, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM users WHERE id = ?', [data.id], (error, results)=>{
               if(!results){
                   return next();
                } else if(results[0].rol =='cliente'){
                    res.clearCookie('access_token');
                   return res.status(201).render('login', { alert : 'cliente' } );
                    //return res.redirect('/login');
                }
                //console.log(results[0].rol);
               req.user = results[0];
               return next();
           })
           } catch {
             return res.sendStatus(403);
           }



    } else{
      return res.status(201).render('login', { alert : 'unauthorized' } );
     //return res.redirect('/login');

    }

  

  };

module.exports = authrol;