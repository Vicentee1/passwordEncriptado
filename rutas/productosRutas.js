var ruta = require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
var { mostrarProductos, nuevoProducto, modificarProducto, buscarProductoPorID, borrarProducto } = require("../bd/productosBD");

ruta.get("/productosm", async (req, res) => {
    var productos = await mostrarProductos();
    res.render("productos/mostrar", { productos });
});

ruta.get("/nuevoproducto", async (req, res) => {
    res.render("productos/nuevo");
});

ruta.post("/nuevoproducto",subirArchivo(), async (req, res) => {
    req.body.foto=req.file.originalname;
    var error = await nuevoProducto(req.body);
    res.redirect("/productosm");
});

ruta.get("/editarProducto/:id",subirArchivo(), async (req, res) => {
    var producto = await buscarProductoPorID(req.params.id);
    res.render("productos/modificar", { producto });
});

ruta.post("/editarProducto",subirArchivo(),async(req,res)=>{
    var producto=await buscarProductoPorID(req.body.id);
    if(req.file){
        req.body.foto=req.file.originalname;
    }else{
        req.body.foto=req.producto.foto;
    }
    var error=await modificarProducto(req.body);
    res.redirect("/productosm");
});

ruta.get("/borrarProducto/:id", async (req, res) => {
    await borrarProducto(req.params.id);
    res.redirect("/productosm");
});

module.exports = ruta;
