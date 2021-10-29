const express = require('express');
const router = express.Router();
const {getlogin,getdashboard,getforgotpass,getcreatenewpass,login,logout,forgotpass,updatenewpass} = require('../controllers/authController');
const {getadmin,data,create,save,edit,update,delet} = require('../controllers/userController');

const {sendemail} = require('../controllers/emailController');

const {authorization,verifytoken} = require('../middleware/auth');
const authrol = require('../middleware/rol');

/*router.get('/',auth,(req, res) => {
    res.render('index',{user:req.user});
});*/

/*router.get('/login',(req, res) => {
    res.render('login',{alert:false});
});*/

/*router.get('/register',(req, res) => {
    res.render('register');
});*/

//LOGIN
router.get('/dashboard',authorization,getdashboard);
router.get('/login',getlogin);
//router.get('/register',getregister);
//router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);




//ADMIN
router.get('/administrator',authrol,getadmin);
router.get('/data',data);


//traemos la vista create
router.get('/create',create);

//traemos la vista reset
router.get('/getforgotpass',getforgotpass);

//envia email
//router.get('/resetpass',sendemail);
router.post('/forgotpass',forgotpass);

//traemos la vista para actualizar la password
router.get('/newpassword/:token',verifytoken,getcreatenewpass);

router.post('/updatenewpass',updatenewpass);

//traemos la vista edit
router.get('/edit/:id',edit);

router.post('/save',save);
router.post('/update',update);

router.get('/delete/:id',delet);


module.exports =router;