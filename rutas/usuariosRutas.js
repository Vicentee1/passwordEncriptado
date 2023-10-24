var ruta=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUsuario, login}=require("../bd/usuariosBD");

ruta.get("/mostrarUsuarios",async(req,res)=>{
    console.log(req.session.usuario);
    if(req.session.usuario){
        var usuarios = await mostrarUsuarios();
        res.render("usuarios/mostrar",{usuarios});   
    }
    else{
        res.redirect("/");
    } 
});

ruta.get("/nuevousuario",async(req,res)=>{
    res.render("usuarios/nuevo");

});

ruta.get("/logout",(req,res)=>{
    req.session=null;
    res.redirect("/");
});


ruta.post("/nuevousuario",subirArchivo(),async(req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    res.redirect("/");
});

ruta.get("/editar/:id",subirArchivo(),async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    res.render("usuarios/modificar",{user});

});

ruta.post("/editar",subirArchivo(),async(req,res)=>{
   // var usuario=await buscarPorID(req.body.id);
    if(req.file!=undefined){
       req.body.foto=req.file.originalname;
    }else{
        req.body.foto=req.body.fotoVieja;
    }
   // req.body.foto=req.file.originalname;
    var error=await modificarUsuario(req.body);
    res.redirect("/");
});

ruta.get("/borrar/:id", async(req,res)=>{
    await borrarUsuario(req.params.id);
    res.redirect("/");

});

ruta.get("/", async (req, res) => {
    res.render("usuarios/login");
  });
  


ruta.post("/",async(req,res)=>{
    var user=await login(req.body);
    if (user==undefined){
        res.redirect("/")
    }
    else{
        req.session.usuario=req.body.usuario;
        console.log(req.session.usuario);
        res.redirect("/mostrarUsuarios");
    }
});

module.exports=ruta;