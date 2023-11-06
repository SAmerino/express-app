import mongoose from "mongoose";
const eventoSchema = mongoose.Schema({
    nombre_evento: {
        type: String,
        required: true,
    },
    candidato1: {
        type: String,
        required: true,
    },
    candidato1_votos: {
        type: Number,
        default: 0,
    },
    candidato2: {
        type: String,
        required: true,
    },
    candidato2_votos: {
        type: Number,
        default: 0,
    },
    candidato3: {
        type: String,
        required: true,
    },
    candidato3_votos: {
        type: Number,
        default: 0,
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true,
    },
    rut_admin: {
        type: String,
        required: true,
    },
    
});

export default mongoose.model("Evento", eventoSchema);