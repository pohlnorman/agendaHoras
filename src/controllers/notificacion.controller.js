import Cita from '../models/cita.model.js';
import Paciente from '../models/paciente.model.js';
import Notificacion from '../models/notificacion.model.js';
import whatsappClient from '../services/whatsapp.service.js';
import moment from 'moment';

// Renderizar la vista principal de notificaciones
export const renderNotificaciones = (req, res) => {
    res.render('notificaciones/gestion');
};

// Obtener citas de mañana para el panel de control
export const obtenerCitasPendientes = async (req, res) => {
    try {
        const manana = moment().add(1, 'days').format('YYYY-MM-DD');
        const citas = await Cita.findAll({
            where: { fecha: manana },
            include: [
                { model: Paciente },
                { model: Notificacion, limit: 1, order: [['createdAt', 'DESC']] }
            ]
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const enviarRecordatorioManual = async (req, res) => {
    try {
        const { citaId } = req.params;
        
        const cita = await Cita.findByPk(citaId, { include: [Paciente] });
        
        if (!cita || !cita.Paciente.telefono) {
            return res.status(404).json({ message: 'Cita o teléfono de paciente no encontrado' });
        }
        
        // 1. Limpiamos el número de espacios, guiones o signos +
        const numero = cita.Paciente.telefono.replace(/\D/g, '');
        // 2. Si el número tiene 9 dígitos (formato Chile sin código), le agregamos el 56
        if (numero.length === 9) {
            numero = '56' + numero;
        }
        const chatId = `${numero}@c.us`;
        console.log("Intentando enviar a:", chatId);

        // 3. VALIDACIÓN CRÍTICA: Verificar si el número está registrado en WhatsApp
        const esValido = await whatsappClient.getNumberId(numero);

        if (!esValido) {
            return res.status(400).json({ message: `El número ${numero} no está registrado en WhatsApp` });
        }

        // Usamos el ID verificado por WhatsApp (esto evita el error LID)
        const mensaje = `Hola ${cita.Paciente.nombre}, te recordamos tu cita para el día ${cita.fecha} a las ${cita.hora}.`;

        await whatsappClient.sendMessage(esValido._serialized, mensaje);

        // Registrar éxito
        await Notificacion.create({
            tipo: 'whatsapp',
            estado: 'enviado',
            citaId: cita.id
        });
        await cita.update({ recordatorio_enviado: true });
        console.log(`Mensaje enviado a ${cita.Paciente.nombre}`);

        res.json({ message: 'WhatsApp enviado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar WhatsApp' });
    }
};