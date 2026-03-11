import { Router } from 'express';
const router = Router();
import { 
    renderNotificaciones, 
    obtenerCitasPendientes, 
    enviarRecordatorioManual 
} from '../controllers/notificacion.controller.js';

router.get('/', renderNotificaciones);
router.get('/pendientes', obtenerCitasPendientes);
router.post('/enviar/:citaId', enviarRecordatorioManual);

export default router;