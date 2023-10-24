var ruta=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
var { mostrarProductos, nuevoProducto, modificarProducto, buscarProductoPorID, borrarProducto } = require("../bd/productosBD");

ruta.get("/api/mostrarProductos",async(req,res)=>{
    var productos = await mostrarProductos();
    if(productos.length>0)
    res.status(200).json(productos);
    else{
        res.status(400).json("No hay productos");
    }
  
});


ruta.get("/api/buscarProductoPorId/:id",async(req, res)=>{
    var product=await buscarProductoPorID(req.params.id);
    if (product==""){
        res.status(400).json("No se encontro este producto");
    }else{
        res.status(200).json(product);
    }

});

ruta.post("/api/editarProducto",subirArchivo(), async(req,res)=>{
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error=await modificarProducto(req.body);
    //res.redirect("/productosm");
    if(error==0){
        res.status(200).json("Producto actualizado")
    }else{
        res.status(400).json("Error al actualizar el producto")
    }
});

ruta.post("/api/nuevoproducto",subirArchivo(),async(req, res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoProducto(req.body);
    if(error==0){
        res.status(200).json("producto registrado");
    }else{
        res.status(400).json("datos incorrectos");
    }    

});

ruta.get("/api/borrarProducto/:id", async(req,res)=>{
    var error=await borrarProducto(req.params.id);
    //res.redirect("/");
    if(error==0){
        res.status(200).json("Producto borrado");
    }else{
        res.status(400).json("Error al borrar el producto");
    }

});

module.exports=ruta;