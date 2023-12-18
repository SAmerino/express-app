import express from "express";
import Evento from "../models/eventos.js";
import currentUser from "../helpers/currentUser.js";
import jwtAuthenticated from "../helpers/jwtAuthenticated.js";

const router = express.Router();

router.get("/eventos", async (req, res) => {
  const events = await Evento.find({});
 
    res.json(
      {allEvents: events.map((current) => {
        return {
          id: current.id,
          nombre_evento: current.nombre_evento,
          fecha_creacion: current.fecha_creacion,
        };
      })
    }
    )
});

router.get("/eventos/:id", async (req, res) => {
  console.log("llamaron al eventos id")
  const user = await currentUser(req);
  const idEvento = req.params.id;
  const evento = await Evento.findOne({_id: idEvento})
  let admin = true;
  if(!user || user.rut !== evento.rut_admin){
    admin = false;
  }
    res.json({
      id: evento._id,
      nombre_evento: evento.nombre_evento,
      candidato1: evento.candidato1,
      candidato1_votos: evento.candidato1_votos,
      candidato2: evento.candidato2,
      candidato2_votos: evento.candidato2_votos,
      candidato3: evento.candidato3,
      candidato3_votos: evento.candidato3_votos,
      estado: evento.estado,
      admin: admin
     })
});

router.get("/votaciones", async (req, res) => {
  const events = await Evento.find({});
  res.json(
    {allEvents: events.map((current) => {
      return {
        id: current.id,
        nombre_evento: current.nombre_evento,
        estado: current.estado,
      };
    })})
});

router.post('/eventos/:id/votar', async (req, res) => {
  const idEvento = req.params.id;
  const evento = await Evento.findOne({_id: idEvento})
  const { numCandidato } = req.body;
  console.log(numCandidato);
  if(evento.estado){
    if (numCandidato === "candidato1") {
      evento.candidato1_votos++;
    } else if (numCandidato === "candidato2") {
      evento.candidato2_votos++;
    } else if (numCandidato === "candidato3") {
      evento.candidato3_votos++;
    }
    await evento.save();
    res.json({success: true, message: "Voto exitoso"});
  }
  else{
    res.json({success: false, message: "Evento finalizado"})
  }
});

router.post("/eventos/crear",jwtAuthenticated, async (req, res) => {
  console.log("llamaron a eventoscrear");
  const user = await currentUser(req);
  const crearEvento = {
    nombre_evento: req.body.nombre_evento,
    candidato1: req.body.candidato1,
    candidato2: req.body.candidato2,
    candidato3: req.body.candidato3,
    rut_admin: user.rut,
  }
  Evento.create(crearEvento);
  res.json({success: true, message: "Evento creado"});
});

router.post("/eventos/actualizarEstado/:id", jwtAuthenticated, async (req,res)=>{
  const user = await currentUser(req);
  const idEvento = req.params.id;
  const estado_Evento= req.body.estado;
  const evento = await Evento.findOne({_id: idEvento})
  if(!user || user.rut !== evento.rut_admin){
    res.json({success: false, message:"Solo usuario que creo el evento puede cambiar el estado o no hay usuario ingresado"});
  }
  else{
    evento.estado = estado_Evento;
    await evento.save();
    res.json({success: true, message:"Actualizacion exitosa"});
  }
});


export default router;