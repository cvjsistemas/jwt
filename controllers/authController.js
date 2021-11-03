const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');// funciona con async y await
const conexion = require('../database/db');
const {sendemail} = require('../controllers/emailController');
const nodemailer = require('nodemailer');
const {promisify}= require('util'); //para promesas 


const getlogin =(req,res )=>{
    res.render('login',{alert:false});
}

const getdashboard =(req,res)=>{
    res.render('index',{user:req.user});
}

const getmanuals =(req,res)=>{
    res.render('manuals',{user:req.user});
}


const getregister =(req, res)=>{
    res.render('register');
}

const getcreatenewpass =(req,res)=>{
    res.render('createnewpass',{user:req.user})
}


const register =async(req, res)=>{
   
    try {

        const name=req.body.nombre;
        const user=req.body.user;
        const pass=req.body.pass;


        let passhash =await bcryptjs.hash(pass,8);

        conexion.query('INSERT INTO users SET ?',{name: name, user:user,pass: passhash},(error, results)=>{
            if(error){
                console.log(error);
            } else{
                res.status(200).redirect('/');
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(401).send({ message: err.message });
    }

  
   
   
    
};



const login =async(req, res)=>{
     try {
        const user=req.body.user;
        const pass=req.body.pass;

        if(!user || !pass){
            res.render('login',{
                alert:'nologeado',
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: 1000,
                ruta: 'login'
            })
        } else {
            conexion.query('SELECT * FROM users WHERE user= ?',[user], async(error,results)=>{
                if( results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass)) ){
                    res.render('login', {
                        alert: 'nologeado',
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    })
                 } else{
                    //incio de sesion ok
                    //console.log(results[0].id);
                  
                    const id = results[0].id;
                    const user=results[0].user;
                    //console.log(id);
                    //return;
                    const token =jwt.sign({id:id},process.env.JWT_SECRETO,{
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                       //generamos el token SIN fecha de expiracion
                   //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)

                   const cookieOptions ={
                       expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                       httpOnly: true
                   }

                   req.session.idusuario = id;
                   req.session.user=user;
                   //console.log(req.session.idusuario );
                   //return;
                   
                   res.cookie('access_token',token,cookieOptions);
                   res.render('login',{
                    alert: 'logeado',
                    alertTitle: "Conexion exitosa",
                    alertMessage: "LOGIN CORRECTO!!",
                    alertIcon:'success',
                    showConfirmButton: false,
                    timer: 800,
                    ruta: 'dashboard'    
                     })

              }
        })
    } 
        
    } catch (err) {
        return res.status(401).send({ message: err.message });
    }
};


/*const isauthenticated = async (req,res,next)=>{//next se usa para los middleware
    
    try {
        await conexion.query('SELECT * FROM users WHERE id = ?', ['1'], (error, results)=>{

        console.log(results);
            if(results.length==0){
                res.status(500).send('No estas autenticado');
            } else{
                req.user = results[0]
                return next()
            }
           
        })
        
    } catch (error) {
        throw error;
    }
   /* if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
     

}; */


const logout =(req, res)=>{
    res.clearCookie('access_token');

    //res.setHeader('set-cookie', 'connect.sid=; max-age=0');
   //res.cookie('connect.sid', "",{expires: Date.now()});

   /*res.cookie('connect.sid', '', {
    domain: 'http://localhost:3000/login',
    maxAge: 0,
    overwrite: true,
  });*/

   //res.redirect('/login');


    //res.redirect('/login');

    req.session.destroy((err) => {
        res.redirect('/login'); // siempre se ejecutará después de que se destruya la sesión
      });


   
}



const getforgotpass=(req,res)=>{
    res.render('forgotpass',{alert:'2'});
}


const forgotpass = (req, res)=>{
    const email = req.body.email;

    if(!email){
        res.status(400).json({message:"email is required"})
    }

    try {
        //1. VERIFICA SI EXISTE EL CORREO

        conexion.query('SELECT * FROM users WHERE email = ?', [email], (error, results)=>{
           if(results.length==0){
                    //return res.sendStatus(400).send('email no registrado')

                    return res.render('resetpass', {
                        alert: 'null',
                        alertTitle: "Error",
                        alertMessage: "Email no registrado",
                        alertIcon:'error',
                        showConfirmButton: false,
                        timer: 1000,
                        ruta: 'getresetpass'    
                    })
                    /*const message='email no registrado';
                    return res.render('resetpass',{message:message});*/
            }
            const id = results[0].id;
            const user = results[0].user;
            //console.log(id);
            //console.log(user);
            //return;
            const token =jwt.sign({id:id,user:user},process.env.JWT_SECRETO,{
                expiresIn: process.env.JWT_TIEMPO_EXPIRA
            })

            const current_datetime = new Date()
            const formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() ;

           // const verificationlink = `http://localhost:3000/newpassword/${token}`;

            const link = process.env.VERIFICATION_LINK_LOCAL + token;

            //console.log(token);
            //return;

            //2.ACTUALIZA EL TOKEN EN LA BASE DE DATOS
            conexion.query('UPDATE users SET ? WHERE id = ?',[{resettoken:token,fechacreatoken:formatted_date,fechamodtoken:formatted_date},id],(error,results)=>{
                if(error){
                    console.log(error);
                } else {
                    //3.ENVIA EL CORREO ELECTRONICO       
                            //res.redirect('/administrator');
                            //sendemail(email,link);

                                // Definimos el transporter
                                
                                    //console.log(email);
                                    //console.log(link);
                                //return;
                               const transporter = nodemailer.createTransport({
                                    //service: 'Gmail',
                                    host:'smtp.gmail.com',
                                    port: 587,
                                    secure: false, 
                                    auth: {
                                        type:'login',
                                        user: process.env.EMAIL_ACCOUNT,
                                        pass: process.env.EMAIL_PASS
                                    }
                                });
                            // Definimos el email
                            const mailOptions = {
                                from: 'draeger.peru.vr@gmail.com',
                            // to: 'draegeraduanas@gmail.com',
                                to: `${email}`,
                                subject: 'Password Reset',
                                //text: 'Contenido del email'
                                html: `<h1>Reset Password</h1><p>Haz click <a href="${link}">aqui</a> para restablecer tu password</p>`
                            };
                            // Enviamos el email
                            transporter.sendMail(mailOptions,(error, info)=>{
                                if (error){
                                    console.log(error);
                                // res.send(500, err.message);
                                return res.render('resetpass', {
                                    alert: 'failed',
                                    alertTitle: "Error",
                                    alertMessage: 'El correo no fue enviado debido a un error',
                                    alertIcon:'error',
                                    showConfirmButton: false,
                                    timer: 2000,
                                    ruta: 'login'    
                                })
                                } else {
                                    
                                    const message = "Se envio un link al correo para resetear tu password";

                                    console.log("Email sent");

                                    return res.render('resetpass', {
                                        alert: 'enviado',
                                        alertTitle: "OK",
                                        alertMessage: message,
                                        alertIcon:'success',
                                        showConfirmButton: false,
                                        timer: 2000,
                                        ruta: 'login'    
                                    });
                                  //res.status(200).json({alert:'enviado'});
                                // return res.redirect('/login');
                                    //res.render('resetpass',{message:message});
                                }

                        });
                     }   
            }); 
            
       });


       } catch (err) {
            return res.status(401).send({ message: err.message });
       }
}


const updatenewpass = async(req, res)=>{

    
    const newpass=req.body.newpass;
    const user=req.body.user;



    /*console.log(newpass);
    console.log(user);
    return;*/
    
    //console.log(formatted_date)
    //const resettoken =req.headers.reset;

    if(!newpass){
        return res.sendStatus(400).send('Debe ingresar una pass');
    }



    const current_datetime = new Date()
    const formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() ;
    


    let passhash =await bcryptjs.hash(newpass,8);

    try {
        conexion.query('UPDATE users SET ? WHERE user = ?',[{pass:passhash,fechamodtoken:formatted_date},user],(error,results)=>{
            if(error){
                console.log(error);
            } else {
               //return res.redirect('/login');
               return res.status(200).json({message:'success'});
            }
        });
        
    } catch (err) {
        return res.status(401).send({ message: err.message });
    }
    //console.log(user + " " + rol);
  
}

module.exports ={
    getlogin,
    getdashboard,
    getmanuals,
    getregister,
    register,
    login,
    logout,
    getforgotpass,
    getcreatenewpass,
    forgotpass,
    updatenewpass
}

