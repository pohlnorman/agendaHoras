import { Router } from "express";
import { renderHistorial, obtenerHistorialPaciente } from "../controllers/historial.controller.js";
import { enviarRecordatorioManual } from '../controllers/notificacion.controller.js'

const router = Router();

router.get('/', renderHistorial); // La vista principal
router.get('/paciente/:id', obtenerHistorialPaciente); // API para el historial
router.post('/enviar-manual/:citaId', enviarRecordatorioManual);

export default router;