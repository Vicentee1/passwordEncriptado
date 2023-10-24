var admin=require("firebase-admin");
var keys=require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var micuenta=admin.firestore();
var conexionUsuarios=micuenta.collection("miproyectoBD1"); 
var conexionProductos=micuenta.collection("misproductos"); 

module.exports={
    conexionUsuarios,
    conexionProductos
};
