import express from "express";
import User from "../models/user.js";
import Evento from "../models/eventos.js";
import jwt from "jsonwebtoken";
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";
import currentUser from "../helpers/currentUser.js";

const router = express.Router();


router.post("/crear", async (req, res) => {
  const { name, rut, password } = req.body;
  const existeUsuario = await User.findOne({ rut });

  if(existeUsuario){
    res.json({ success:  false, message: "El rut ya está en uso."})
  }
  else{
    if(rut.length < 11 || rut.length >12){
      res.json({ success:false, message: "Ingrese un rut valido"})
    }
    else if(password.length < 8) {
      res.json({success: false, message: "La contraseña debe ser minimo de 8 caracteres."})
    }
    else{
      User.create({name, rut, password});
      res.json({success: true});
    }
  }
});

router.post("/ingresar", async (req, res) => {
  console.log("llamaron al login");
  const currentUser = await User.findOne({rut: req.body.rut});
  if(!currentUser || currentUser.password !== req.body.password){
    res.json({success: false, message: "El usuario no existe o verifique sus datos ingresados"});
    return;
  }

  const payload = currentUser["_doc"];
  delete payload.password;
  const signedJWT = jwt.sign(payload, process.env.JWT_PASS, {
    expiresIn: "1h",
  })

  res.json({success: true, jwt: signedJWT})

})

router.get("/elecciones_user", jwtAuthenticated, async (req, res) => {
  const user = await currentUser(req);
  const events = await Evento.find({rut_admin: user.rut});
  res.json(
    {allEvents: events.map((current) => {
      return {
        id: current.id,
        nombre_evento: current.nombre_evento,
        fecha_creacion: current.fecha_creacion,
      };
    })
  })
});

router.get("/corriente", jwtAuthenticated , async (req,res)=>{
  const user = await currentUser(req);
  if(user===null || user===undefined){
    res.json({success: false, message: "Usuario no encontrado"});
  }
  else{
    res.json({name: user.name, success: true});
  }
});

export default router;
