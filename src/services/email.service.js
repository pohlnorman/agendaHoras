import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const enviarEmail = async ({ to, nombre, fecha, hora }) => {
  try {
    await transporter.sendMail({
      from: `"Consulta Médica" <${process.env.MAIL_USER}>`,
      to,
      subject: "Recordatorio de hora médica",
      html: `
        <h3>Hola ${nombre}</h3>
        <p>Le recordamos que tiene una hora médica agendada para:</p>
        <p><strong>${fecha} a las ${hora}</strong></p>
        <p>Por favor asistir con 10 minutos de anticipación.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};