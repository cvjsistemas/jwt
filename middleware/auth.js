const jwt = require('jsonwebtoken');
const conexion = require('../database/db');
const Swal = require('sweetalert2');
//var config = require('../config');

const authorization = (req, res, next) => {
   // const cookie =  req.headers.cookie;

    const cookie =  req.cookies.access_token;

    //console.log(cookie);
    //return;

   

    /*if (req.session.loggedin) {
      res.render('index',{
        login: true,
        name: req.session.name			
      });		
    } else {
      res.render('index',{
        login:false,
        name:'Debe iniciar sesión',			
      });				
    }
    res.end();*/


    if (cookie){

        const token = cookie.split('=').pop();

        //console.log(token);
        //return;
   
        try {
            const data = jwt.verify(token, process.env.JWT_SECRETO);
            conexion.query('SELECT * FROM users WHERE id = ?', [data.id], (error, results)=>{
               if(!results){return next()}
               req.user = results[0];
               return next();
           })
           } catch {
             //return res.sendStatus(403).send('aqui no pasas');
             return res.sendStatus(403);
           }



    } else{
     res.status(201).render('login', { alert : 'unauthorized' } );
     //return res.redirect('/login');

    }

  

  };


  const verifytoken=(req, res, next)=> {

    let resettoken= req.params.token;

    //console.log(resettoken);
    //return;

    if(!resettoken){
      console.log('Please make sure your request has a token');
      return res.redirect('/login');
     /// return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }

    /*if (!req.headers.authorization) {
       return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    const resettoken = req.headers.authorization.split(' ')[1];
    console.log(resettoken);
    return;*/
    

    try {
      conexion.query('SELECT resettoken FROM users WHERE resettoken = ?', [resettoken], (error, results)=>{
         if(results.length==0)
         {
          console.log('token no valido');
          return res.redirect('/login');
        //console.log('token no valido');
       // return res.sendStatus(403).send('Token no valido');
      // return  res.sendStatus(403).render('login',{alert:'invalido'});
        }  else {
          let payload = null;

          payload = jwt.decode(resettoken, process.env.JWT_SECRETO);
          //console.log(payload);
    
          //return;
          const payloaduser=payload.user;
          // console.log(payloaduser);
          // return;
       
             req.user = payloaduser;
             return next();
        }
       // console.log(results[0].resettoken);

     })
     } catch (err) {
     
       return res.status(401).send({ message: err.message });
     }




  /*
    let payload = null;
    try {
      payload = jwt.decode(resettoken, process.env.JWT_SECRETO);
      //console.log(payload);

      //return;
      const payloaduser=payload.user;
      // console.log(payloaduser);
      // return;
   
         req.user = payloaduser;
         return next();
    }
    catch (err) {
      return res.status(401).send({ message: err.message });
    }*/
  
   /* if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Token has expired' });
    }*/
 
  
    //next();
  };

module.exports = {
  authorization,
  verifytoken
}