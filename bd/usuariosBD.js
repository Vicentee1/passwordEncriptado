var conexion=require("./conexion").conexionUsuarios;
var crypto= require("crypto");
var {encriptarPassword, validarPassword}=require("../middlewares/funcionesPassword");
var Usuario=require("../modelos/Usuario");

async function mostrarUsuarios(){
    var users=[];
    try{       
        var usuarios=await conexion.get();
        usuarios.forEach((usuario) => {
            var user=new Usuario(usuario.id, usuario.data());
            if (user.bandera == 0){
                users.push(user.obtenerDatos);
            }    
        });  
    }
    catch(err){
        console.log("Error al recuperar usuarios de la base de datos"+err);
    }
    return users;
}

async function buscarPorID(id){
    var user="";

    try {
        var usuario=await conexion.doc(id).get();
        var usuarioObjeto=new Usuario(usuario.id, usuario.data());
        if (usuarioObjeto.bandera === 0){
            user=usuarioObjeto.obtenerDatos;
            console.log(user);
        }

    }

    catch(err){
        console.log("Error al recuperar al usuario" + err);
        
    }

    return user;

}

async function nuevoUsuario(datos){
    var {hash,salt}=encriptarPassword(datos.password);
    datos.password=hash;
    datos.salt=salt;
    datos.admin=false; //
    var user=new Usuario(null, datos);
  //  console.log(user);
    var error=1;
    if (user.bandera === 0){
    try{
      //  var {hash,salt}=encriptarPassword(user.obtenerDatos.password);
      //  user.password=hash;
      //  user.salt=salt;
     //   console.log(user.obtenerDatos);
        await conexion.doc().set(user.obtenerDatos);
        console.log("Usuario insertado a la BD");
        error=0;
    }

    catch(err){
        console.log("Error al capturar al nuevo usuario"+err);

    }

  }
  return error;

}

async function modificarUsuario(datos){

  //  var user=new Usuario(datos.id,datos)
   // if(datos.foto==""){
  //  console.log(foto);
   // console.log(datos.fotoVieja);
  //  console.log(datos.password);
   // console.log(datos.passwordViejo);
    //}
    var error=1;
    var respuestaBuscar=await buscarPorID(datos.id);
    if(respuestaBuscar=!undefined){
        if(datos.password=""){
            datos.password=datos.passwordViejo;
            datos.salt=datos.saltViejo;
        }
        else{
            var{salt,hash}=encriptarPassword(datos.password);
            datos.password=hash;
            datos.salt=salt;
        }
        var user=new Usuario(datos.id,datos);
        if (user.bandera === 0){
            try{
               await conexion.doc(user.id).set(user.obtenerDatos);
                console.log("Registro actualizado");
                error=0;

            }
            catch(err){
                console.log("Error al modificar al usuario"+err);

            }
        }
        return error;

    }
}

async function borrarUsuario(id){
    var error=1;
    var user= await buscarPorID(id);
    if(user!=undefined){  
        try{
            await conexion.doc(id).delete();
            //console.log(respuestafirebase);
            console.log("Registro borrado");
            error=0;

        }

        catch(err){
            console.log("Error al borrar el usuario" + err);

        }
    }
    return error;
}

async function login(datos){
    var user=undefined;
    var usuarioObjeto;
    try{
        var usuarios=await conexion.where('usuario','==',datos.usuario).get();
        if(usuarios.docs.length==0){
            return undefined
        }
        usuarios.docs.filter((doc)=>{
            var validar=validarPassword(datos.password,doc.data().password,doc.data().salt);
            if(validar){
                usuarioObjeto=new Usuario(doc.id, doc.data());
                if(usuarioObjeto.bandera==0){
                    user=usuarioObjeto.obtenerDatos;
                }
            }
            else
                return undefined;
        });
    }
    catch(err){
        console.log("Error al recuperar al usuario"+err);
    }
    return user;
}

module.exports={
    mostrarUsuarios,
    buscarPorID,
    nuevoUsuario,
    modificarUsuario,
    borrarUsuario, 
    login
}