import { Op } from 'sequelize';
import Cita from '../models/cita.model.js';
import Paciente from '../models/paciente.model.js';
import Notificacion from '../models/notificacion.model.js';
import whatsappClient from './whatsapp.service.js';
import moment from 'moment';

export const enviarRecordatoriosManana = async () => {
    console.log('--- INICIANDO PROCESO DE RECORDATORIOS AUTOMÁTICOS ---');
    try {
        // 1. Verificar si el cliente de WhatsApp está conectado antes de empezar
        if (!whatsappClient.info || !whatsappClient.info.wid) {
            console.error('❌ Abortando: WhatsApp no está conectado en el servidor.');
            return;
        }

        const manana = moment().add(1, 'days').format('YYYY-MM-DD');

        // 2. Buscar citas de mañana con datos del paciente
        const citas = await Cita.findAll({
            where: { fecha: manana },
            include: [{ model: Paciente }]
        });

        console.log(`Se encontraron ${citas.length} citas para el día ${manana}`);

        for (const cita of citas) {
            const paciente = cita.Paciente;
            // Validación básica de datos
            if (!paciente || !paciente.telefono) {
                console.log(`⚠️ Saltando cita ${cita.id}: Paciente sin teléfono.`);
                continue;
            }

            try {
                // 3.Formatear número (Ej: 56912345678)
                let numero = paciente.telefono.replace(/\D/g, '');
                if (numero.length === 9) {
                    numero = '56' + numero; // Prefijo Chile
                }
                const chatId = `${numero}@c.us`;
                console.log("Intentando enviar a:", chatId);

                // 4. Validación de existencia en WhatsApp (Evita Error: No LID for user)
                const contactoInfo = await whatsappClient.getNumberId(numero);

                if (!contactoInfo) {
                    console.error(`❌ El número ${numero} de ${paciente.nombre} no tiene WhatsApp.`);
                    await Notificacion.create({
                        tipo: 'whatsapp',
                        estado: 'error',
                        mensaje_error: 'Número no registrado en WhatsApp',
                        citaId: cita.id
                    });
                    continue;
                }

                // 5. Envío de mensaje usando el ID verificado
                const mensaje = `Hola ${paciente.nombre}, te recordamos que tienes una cita mañana ${cita.fecha} a las ${cita.hora.substring(0, 5)}. ¡Te esperamos!`;

                await whatsappClient.sendMessage(contactoInfo._serialized, mensaje);
                
                // 6.Registrar en la DB
                await Notificacion.create({
                    tipo: 'whatsapp',
                    estado: 'enviado',
                    citaId: cita.id
                });
                console.log(`Mensaje enviado a ${paciente.nombre}`);

            } catch (err) {
                await Notificacion.create({
                    tipo: 'whatsapp',
                    estado: 'error',
                    mensaje_error: err.message,
                    citaId: cita.id
                });
                console.error(`Error enviando a ${paciente.nombre}:`, err);
            }
        }
        console.log('--- FIN DEL PROCESO DE RECORDATORIOS ---');
    } catch (error) {
        console.error('Error en el proceso de notificaciones:', error);
    }
};