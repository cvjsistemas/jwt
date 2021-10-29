const conexion= require('../database/db.js');
const bcryptjs = require('bcryptjs');// funciona con async y await



const getadmin =(req,res)=>{
    //res.render('index',{var1:'Esto es una variable'});
    //res.render('index');
   /*conexion.query('SELECT * FROM users',(error,results)=>{
        if (error) {
            throw error;
        } else{
            //res.send(results);
            res.render('indexadmin',{results:results});
        }
    });*/

    //const logeado = req.session.id;

    //console.log(logeado);
    //return;


    res.render('indexadmin',{user:req.user});

};

const data =(req,res)=>{

   conexion.query('SELECT u.id,u.user,u.name,u.email,r.rol FROM users u INNER JOIN roles r ON u.idrol=r.idrol',(error,results)=>{
        if (error) {
            throw error;
        } else{
            const data=JSON.stringify(results);
            res.send(data);
        }
    });

};

//traemos la vista create
const create = (req,res)=>{

   const id =req.session.idusuario;
   const user =req.session.user;
  // console.log(id);
   //return;

    conexion.query('SELECT * FROM roles',(error,results)=>{
        if (error) {
            throw error;
        } else{
            //res.send(results);
            res.render('createuser',{roles:results ,id:id,user:user});
        }
    });


   // res.render('createuser');
};




/*const register =async(req, res)=>{
   
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

    } catch (error) {
        console.log(error);
    }

  
   
   
    
};*/



const save = async(req, res)=>{
    const user=req.body.user;
    const nombre = req.body.nombre;
    const rol=req.body.rol;
    const pass=req.body.pass;
    const email=req.body.email;
    const id = req.body.idusuario;
    let passhash =await bcryptjs.hash(pass,8);



    //console.log(user + " " + rol);
    conexion.query('INSERT INTO users SET ?',{user:user,name:nombre,pass:passhash,email:email,idrol:rol,idusucrea:id,idusumod:id},(error,results)=>{
        if(error){
            console.log(error);
        } else {
            res.redirect('/administrator');
        }
    })
};

//traemos la vista edit
const edit =(req,res)=>{

    const id=req.params.id;

    const username =req.session.user;
    

    const idusuario =req.session.idusuario;
    conexion.query('SELECT u.id,u.user,u.name,u.pass,u.email,r.rol,r.idrol FROM users u INNER JOIN roles r ON u.idrol=r.idrol WHERE u.id=?',[id],(error,results)=>{
        if (error) {
            throw error;
        } else{
            //res.send(results);
            res.render('edituser',{user:results[0], id:idusuario,username:username});
        }
    });

};


const update = async(req, res)=>{
    const id=req.body.id;
    const user=req.body.user;
    const nombre = req.body.nombre;
    const email= req.body.email;
    const rol=req.body.rol;
    const pass=req.body.pass;

    const idusuario = req.body.idusuario;
    
    const current_datetime = new Date()
    const formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() ;
    //console.log(formatted_date)





    let passhash =await bcryptjs.hash(pass,8);
    //console.log(user + " " + rol);
    conexion.query('UPDATE users SET ? WHERE id = ?',[{user:user,name:nombre,pass:passhash,email:email,idrol:rol,idusumod:idusuario,fechamod:formatted_date},id],(error,results)=>{
        if(error){
            console.log(error);
        } else {
            res.redirect('/administrator');
        }
    })
};

const delet = (req, res)=>{
    const id=req.params.id;
    conexion.query('DELETE FROM users WHERE id=?',[id],(error,results)=>{
        if (error) {
            throw error;
        } else{
            //res.send(results);
            res.redirect('/administrator');
        }
    });
};
/*exports.save((req,res)=>{
    const user=req.body.user;
    const rol=req.body.rol;
});*/

module.exports={
  
    getadmin,
    data,
    create,
    save,
    edit,
    update,
    delet
}