var ruta=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
var {mostrarUsuarios, nuevoUsuario, modificarUsuario, buscarPorID, borrarUsuario}=require("../bd/usuariosBD");

ruta.get("/api/mostrarUsuarios",async(req,res)=>{
    var usuarios = await mostrarUsuarios();
    //res.render("usuarios/mostrar",{usuarios});
    if(usuarios.length>0)
    res.status(200).json(usuarios);
    else{
        res.status(400).json("No hay usuarios");
    }
  
});


ruta.get("/api/buscarUsuarioPorId/:id",async(req, res)=>{
    var user=await buscarPorID(req.params.id);
    console.log(user);
    res.render("usuarios/modificar",{user});
    if (user==""){
        res.status(400).json("No se encontro este usuario");
    }else{
        res.status(200).json(user);
    }

});

ruta.post("/api/editarUsuario",subirArchivo(), async(req,res)=>{
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error=await modificarUsuario(req.body);
    //res.redirect("/");
    if(error==0){
        res.status(200).json("Usuario actualizado")
    }else{
        res.status(400).json("Error al actualizar el usuario")
    }
});

ruta.post("/api/nuevousuario",subirArchivo(),async(req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    if(error==0){
        res.status(200).json("usuario registrado");
    }else{
        res.status(400).json("datos incorrectos");
    }    

});

ruta.get("/api/borrarUsuario/:id", async(req,res)=>{
    var error=await borrarUsuario(req.params.id);
    //res.redirect("/");
    if(error==0){
        res.status(200).json("Usuario borrado");
    }else{
        res.status(400).json("Error al borrar el usuario");
    }

});

module.exports=ruta;