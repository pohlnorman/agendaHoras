import  Cita from "../models/cita.model.js";
import Paciente from "../models/paciente.model.js";

/* =========================
   LISTAR CITAS
========================= */
export const listarCitas = async (req, res) => {
  try {
    const citas = await Cita.findAll({
      include: [
        {
          model: Paciente,
          attributes: ['nombre']
        }
      ],
      order: [["fecha", "ASC"], ["hora", "ASC"]],
      raw: true,
      nest: true
    });
    console.log(Paciente)
    res.render("citas/listar", { citas });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener citas");
  }
};

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

/* =========================
   FORM EDITAR
========================= */
export const formularioEditarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findByPk(id,{
      include: {
        model: Paciente
      },
      raw: true,
      nest: true
    });

    // Si la cita no existe, manejamos el error
    if (!cita) {
      return res.status(404).send("Cita no encontrada");
    }

    const pacientes = await Paciente.findAll({ 
      where: { activo: true },
      raw: true
    });

    res.render("citas/editar", { cita, pacientes });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cargar cita");
  }
};

/* =========================
   ACTUALIZAR
========================= */
export const actualizarCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);

    await cita.update({
      pacienteId: req.body.pacienteId,
      fecha: req.body.fecha,
      hora: req.body.hora,
      observacion: req.body.observacion,
      estado: req.body.estado,
      recordatorio_enviado: false, // Si se modifica, vuelve a permitir recordatorio
    });

    res.redirect("/citas");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar cita");
  }
};

/* =========================
   ELIMINAR
========================= */
export const eliminarCita = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    await cita.destroy();

    res.redirect("/citas");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar cita");
  }
};