import express from "express";
import User from "../models/user.js";
import Evento from "../models/eventos.js";
import jwt from "jsonwebtoken";
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";
import currentUser from "../helpers/currentUser.js";
import isAuthenticated from "../helpers/isAuthenticated.js";

const router = express.Router();

router.get("/crear", (req, res) => {
  res.render("user/registrar");
});

router.post("/crear", async (req, res) => {
  const { name, rut, password } = req.body;
  const existeUsuario = await User.findOne({ rut });

  if(existeUsuario){
    res.render("user/registrar", {errorRut: "El rut ya está en uso."})
  }
  else{
    if(rut.length < 11 || rut.length >12){
      res.render("user/registrar", {errorRut: "Ingrese un rut valido"})
    }
    else if(password.length < 8) {
      res.render("user/registrar", {errorPass: "La contraseña debe ser minimo de 8 caracteres."})
    }
    else{
      User.create({name, rut, password});
      res.render("user/ingresar");
    }
  }
});

router.get("/crear_eleccion",jwtAuthenticated, async (req, res) => {
  const user = await currentUser(req);
  if(isAuthenticated(req)){
    res.render("user/crear_evento", { isAuthenticated: isAuthenticated(req), nombre: user.name} );
  }
  else{
    res.render("user/crear_evento", { isAuthenticated: isAuthenticated(req) } );
  }
});

router.post("/crear_eleccion",jwtAuthenticated, async (req, res) => {
  const user = await currentUser(req);
  const crearEvento = {
    nombre_evento: req.body.nombre_evento,
    candidato1: req.body.candidato1,
    candidato2: req.body.candidato2,
    candidato3: req.body.candidato3,
    rut_admin: user.rut,
  }
  Evento.create(crearEvento);
  res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("user/ingresar");
})

router.post("/login", async (req, res) => {
  const currentUser = await User.findOne({rut: req.body.rut});
  if(!currentUser || currentUser.password !== req.body.password){
    res.render("user/ingresar", {error: "El usuario no existe o verifique sus datos ingresados"});
    return;
  }

  const payload = currentUser["_doc"];
  delete payload.password;
  const signedJWT = jwt.sign(payload, process.env.JWT_PASS, {
    expiresIn: "1h",
  })

  res.cookie("jwt", signedJWT).redirect("/");

})

router.get("/logout", (req, res) =>{
  res.clearCookie("jwt");
  res.redirect("login");
});

router.get("/elecciones_user", jwtAuthenticated, async (req, res) => {
  const user = await currentUser(req);
  const events = await Evento.find({rut_admin: user.rut});
  if(isAuthenticated(req)){
    res.render("user/elecciones_user", {
      allEvents: events.map((current) => {
        return {
          id: current.id,
          nombre_evento: current.nombre_evento,
          fecha_creacion: current.fecha_creacion,
        };
      }),
      isAuthenticated: isAuthenticated(req),
      nombre:user.name,
    });
  }
  else{
    res.render("user/elecciones_user", {
      allEvents: events.map((current) => {
        return {
          id: current.id,
          nombre_evento: current.nombre_evento,
          fecha_creacion: current.fecha_creacion,
        };
      }),
      isAuthenticated: isAuthenticated(req),
    });
  }
  
});

router.get("/finalizar_votacion/:id", jwtAuthenticated, async (req,res)=>{
  const user = await currentUser(req);
  const idEvento = req.params.id;
  const evento = await Evento.findOne({_id: idEvento})
  if(!user || user.rut !== evento.rut_admin){
    res.redirect("/");
  }
  else{
    evento.estado = false;
    await evento.save();
    res.redirect("/user/elecciones_user");
  }
});

export default router;
