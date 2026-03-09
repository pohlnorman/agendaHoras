import { Router } from "express";
import {
  formularioCrearCita,
  crearCita,
} from "../controllers/cita.controller.js";

const router = Router();


router.get("/crear", formularioCrearCita);
router.post("/crear", crearCita);

export default router;