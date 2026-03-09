import  Cita from "../models/cita.model.js";
import Paciente from "../models/paciente.model.js";

/* =========================
   FORM CREAR
========================= */
export const formularioCrearCita = async (req, res) => {
  try {
    // Capturamos fecha y hora desde la URL (si vienen)
    const { fecha, hora } = req.query;

    const pacientes = await Paciente.findAll({ 
      where: { activo: true },
      raw: true
    });

    res.render("citas/crear", { 
      pacientes,
      fechaSeleccionada: fecha,
      horaSeleccionada: hora
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar formulario");
  }
};

/* =========================
   CREAR CITA
========================= */
export const crearCita = async (req, res) => {
  try {
    const { pacienteId, fecha, hora, observacion } = req.body;

    await Cita.create({
      pacienteId,
      fecha,
      hora,
      observacion,
    });

    res.redirect("/agenda");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear cita");
  }
};

