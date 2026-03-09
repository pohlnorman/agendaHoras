import { Op } from "sequelize";
import { Cita, Paciente, Notificacion } from "../models/index.js";
import { enviarEmail } from "./email.service.js";
//import { enviarSMS } from "./sms.service.js";

export const enviarRecordatorios = async () => {
  try {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);

    const fechaBusqueda = mañana.toISOString().split("T")[0];

    const citas = await Cita.findAll({
      where: {
        fecha: fechaBusqueda,
        estado: "agendada",
        recordatorio_enviado: false,
      },
      include: [
        {
          model: Paciente,
          where: { activo: true },
        },
      ],
    });

    console.log(`🔎 Se encontraron ${citas.length} citas para mañana`);

    for (const cita of citas) {
      const paciente = cita.Paciente;

      let envioExitoso = true;

      // 📧 EMAIL
      if (paciente.recordatorio_email && paciente.email) {
        const resultadoEmail = await enviarEmail({
          to: paciente.email,
          nombre: paciente.nombre,
          fecha: cita.fecha,
          hora: cita.hora,
        });

        await Notificacion.create({
          citaId: cita.id,
          tipo: "email",
          estado: resultadoEmail.success ? "enviado" : "error",
          mensaje_error: resultadoEmail.error || null,
        });

        if (!resultadoEmail.success) envioExitoso = false;
      }

      // 📱 SMS
      /* if (paciente.recordatorio_sms && paciente.telefono) {
        const mensaje = `Recordatorio: Tiene hora médica el ${cita.fecha} a las ${cita.hora}.`;

        const resultadoSMS = await enviarSMS({
          telefono: paciente.telefono,
          mensaje,
        });

        await Notificacion.create({
          citaId: cita.id,
          tipo: "sms",
          estado: resultadoSMS.success ? "enviado" : "error",
          mensaje_error: resultadoSMS.error || null,
        });

        if (!resultadoSMS.success) envioExitoso = false;
      }
 */
      // Si todo salió bien, marcamos como enviado
      if (envioExitoso) {
        await cita.update({ recordatorio_enviado: true });
      }
    }

    console.log("✅ Proceso de recordatorios finalizado");
  } catch (error) {
    console.error("❌ Error en el servicio de recordatorios:", error);
  }
};