import { Router } from 'express';
import { renderAgenda, obtenerEventos, eliminarCita } from '../controllers/agenda.controller.js';


const router = Router();

router.get('/', renderAgenda);

router.get('/events', obtenerEventos);
router.post('/citas/eliminar/:id',eliminarCita );


export default router;