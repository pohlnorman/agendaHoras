import { Router } from "express";
import {
  listarCitas,
  formularioCrearCita,
  crearCita,
  formularioEditarCita,
  actualizarCita,
  eliminarCita,
} from "../controllers/cita.controller.js";

const router = Router();

router.get("/", listarCitas);
router.get("/crear", formularioCrearCita);
router.post("/crear", crearCita);
router.get("/editar/:id", formularioEditarCita);
router.post("/editar/:id", actualizarCita);
router.get("/eliminar/:id", eliminarCita);

export default router;