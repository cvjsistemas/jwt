const nodemailer = require('nodemailer');
// email sender function
const sendemail =(email, link)=>{
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
            user: 'cvj.galaxy@gmail.com',
            pass: 'galaxy2016'
        }
    });
// Definimos el email
const mailOptions = {
    from: 'cvj.galaxy@gmail.com',
   // to: 'draegeraduanas@gmail.com',
    to: `${email}`,
    subject: 'Asunto',
    //text: 'Contenido del email'
    html: `<h1>Reset Password</h1><p>Haz click <a href="${link}">aqui</a> para restablecer tu password</p>`
};
// Enviamos el email
transporter.sendMail(mailOptions,(error, info)=>{
    if (error){
        console.log(error);
       // res.send(500, err.message);
       return email.render('resetpass', {
        alert: 'failed',
        alertTitle: "Error",
        alertMessage: 'El correo no fue enviado debido a un error',
        alertIcon:'error',
        showConfirmButton: true,
        timer: 2000,
        ruta: 'login'    
    })
    } else {
        
    const message = "Se envio un link al correo para resetear tu password";

      console.log("Email sent");

      return email.render('resetpass', {
        alert: 'enviado',
        alertTitle: "OK",
        alertMessage: message,
        alertIcon:'success',
        showConfirmButton: true,
        timer: 2000,
        ruta: 'login'    
    });



      //  res.status(200).jsonp(req.body);
       // return res.redirect('/login');
        //res.render('resetpass',{message:message});
    }
});


};
module.exports ={
    sendemail
}