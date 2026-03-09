import { Router } from "express";
import {
  listarPacientes,
  formularioCrearPaciente,
  crearPaciente,
  formularioEditarPaciente,
  actualizarPaciente,
  eliminarPaciente,
  buscarPacientePorRut,
  sugerenciasPacientes
} from "../controllers/paciente.controller.js";

const router = Router();

router.get("/", listarPacientes);
router.get("/crear", formularioCrearPaciente);
router.post("/crear", crearPaciente);
router.get("/editar/:id", formularioEditarPaciente);
router.post("/editar/:id", actualizarPaciente);
router.get("/eliminar/:id", eliminarPaciente);
router.get("/buscar/:rut", buscarPacientePorRut);
router.get("/sugerencias", sugerenciasPacientes);

export default router;