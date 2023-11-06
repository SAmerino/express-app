import express from "express";
import Evento from "../models/eventos.js";
import isAuthenticated from "../helpers/isAuthenticated.js";
import currentUser from "../helpers/currentUser.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const user = await currentUser(req);
  if(isAuthenticated(req)){
    res.render("home", { isAuthenticated: isAuthenticated(req), nombre: user.name, pagInicio: true }); 
  }
  else{
    res.render("home",{ isAuthenticated: isAuthenticated(req), pagInicio: true} )
  }
});

router.get("/elecciones", async (req, res) => {
  const user = await currentUser(req);
  const events = await Evento.find({});
  if(isAuthenticated(req)){
    res.render("elecciones", {
      allEvents: events.map((current) => {
        return {
          id: current.id,
          nombre_evento: current.nombre_evento,
          fecha_creacion: current.fecha_creacion,
        };
      }),
      isAuthenticated: isAuthenticated(req),
      pagElecc: true,
      nombre: user.name,
    });
  }
  else{
    res.render("elecciones", {
      allEvents: events.map((current) => {
        return {
          id: current.id,
          nombre_evento: current.nombre_evento,
          fecha_creacion: current.fecha_creacion,
        };
      }),
      isAuthenticated: isAuthenticated(req),
      pagElecc: true,
    });
  }
});


router.get("/elecciones_detalles/:id", async (req, res) => {
  const user = await currentUser(req);
  const idEvento = req.params.id;
  const evento = await Evento.findOne({_id: idEvento})
  let admin = true;
  if(!user || user.rut !== evento.rut_admin){
    admin = false;
  }
  if(isAuthenticated(req)){
    res.render("elecciones_detalles", {isAuthenticated: isAuthenticated(req),
      id: evento._id,
      nombre_evento: evento.nombre_evento,
      candidato1: evento.candidato1,
      candidato1_votos: evento.candidato1_votos,
      candidato2: evento.candidato2,
      candidato2_votos: evento.candidato2_votos,
      candidato3: evento.candidato3,
      candidato3_votos: evento.candidato3_votos,
      estado: evento.estado,
      admin: admin,
      nombre: user.name,
 
     })
  }
  else{
    res.render("elecciones_detalles", {isAuthenticated: isAuthenticated(req),
      id: evento._id,
      nombre_evento: evento.nombre_evento,
      candidato1: evento.candidato1,
      candidato1_votos: evento.candidato1_votos,
      candidato2: evento.candidato2,
      candidato2_votos: evento.candidato2_votos,
      candidato3: evento.candidato3,
      candidato3_votos: evento.candidato3_votos,
      estado: evento.estado,
      admin: admin,
 
     })
  }
});

router.get("/votaciones", async (req, res) => {
  const events = await Evento.find({});
  const user = await currentUser(req);
  if(isAuthenticated(req)){
    res.render("votaciones", {
      allEvents: events.map((current) => {
        return {
          id: current.id,
          nombre_evento: current.nombre_evento,
          estado: current.estado
        };
      }),
      isAuthenticated: isAuthenticated(req),
      nombre: user.name,
    });
  }
  else{
    res.render("votaciones", {
      allEvents: events.map((current) => {
        return {
          id: current.id,
          nombre_evento: current.nombre_evento,
          estado: current.estado
        };
      }),
      isAuthenticated: isAuthenticated(req),
    });
  }
})

router.get("/votar/:id", async (req, res) => {
  const user = await currentUser(req);
  const idEvento = req.params.id;
  let nombre = null;
  const evento = await Evento.findOne({_id: idEvento})
  if(isAuthenticated(req)){
    res.render("votar", {isAuthenticated: isAuthenticated(req),
      id: evento._id,
      nombre_evento: evento.nombre_evento,
      candidato1: evento.candidato1,
      candidato2: evento.candidato2,
      candidato3: evento.candidato3,
      nombre: nombre = user.name,
      })
  }
  else{
    res.render("votar", {isAuthenticated: isAuthenticated(req),
      id: evento._id,
      nombre_evento: evento.nombre_evento,
      candidato1: evento.candidato1,
      candidato2: evento.candidato2,
      candidato3: evento.candidato3,
      })
  }
});

router.post('/votar/:id', async (req, res) => {
  const idEvento = req.params.id;
  const evento = await Evento.findOne({_id: idEvento})
  const { candidatos } = req.body;
  if (candidatos === "candidato1") {
    evento.candidato1_votos++;
  } else if (candidatos === "candidato2") {
    evento.candidato2_votos++;
  } else if (candidatos === "candidato3") {
    evento.candidato3_votos++;
  }
  await evento.save();
  res.redirect('/votaciones');
});

export default router;