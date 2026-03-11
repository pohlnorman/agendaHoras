import { Router } from "express";
import { renderHistorial, obtenerHistorialPaciente } from "../controllers/historial.controller.js";

const router = Router();

router.get('/', renderHistorial); // La vista principal
router.get('/paciente/:id', obtenerHistorialPaciente); // API para el historial

export default router;