import  Paciente  from "../models/paciente.model.js";
import { Op } from 'sequelize';

/* =========================
   LISTAR PACIENTES
========================= */
export const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.findAll({
      order: [["createdAt", "DESC"]],
      raw : true
    });

    res.render("pacientes/listar", { pacientes });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener pacientes");
  }
};

/* =========================
   VISTA FORMULARIO CREAR PACIENTE
========================= */
export const formularioCrearPaciente = (req, res) => {
  res.render("pacientes/crear");
};

/* =========================
   CREAR PACIENTE
========================= */
export const crearPaciente = async (req, res) => {
  try {
    const {
      rut,
      nombre,
      email,
      telefono,
      recordatorio_email,
      recordatorio_sms,
    } = req.body;

    await Paciente.create({
      rut,
      nombre,
      email,
      telefono,
      recordatorio_email: recordatorio_email === "on",
      recordatorio_sms: recordatorio_sms === "on",
    });

    res.redirect("/pacientes");
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.render('pacientes/crear', { error: 'El RUT ya está registrado.' });
    }
    console.error(error);
    res.status(500).send("Error al crear paciente");
  }
};

/* =========================
   FORM EDITAR
========================= */
export const formularioEditarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id,{
      raw: true
    });
    res.render("pacientes/editar", { paciente });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener paciente");
  }
};

/* =========================
   ACTUALIZAR
========================= */
export const actualizarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);

    await paciente.update({
      nombre: req.body.nombre,
      email: req.body.email,
      telefono: req.body.telefono,
      recordatorio_email: req.body.recordatorio_email === "on",
      recordatorio_sms: req.body.recordatorio_sms === "on",
    });

    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar paciente");
  }
};

/* =========================
   ELIMINAR (SOFT DELETE)
========================= */
export const eliminarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByPk(req.params.id);

    await paciente.update({ activo: false });

    res.redirect("/pacientes");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar paciente");
  }
};

// buscar paciente por rut
export const buscarPacientePorRut = async (req, res) => {
  try {
    const { rut } = req.params;
    const paciente = await Paciente.findOne({ 
      where: { rut: rut, activo: true },
      raw: true 
    });
    
    if (paciente) {
      res.json(paciente);
    } else {
      res.status(404).json(null);
    }
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const sugerenciasPacientes = async (req, res) => {
    try {
        const { q } = req.query; // Lo que el usuario escribe
        const pacientes = await Paciente.findAll({
            where: {
                activo: true,
                [Op.or]: [
                    { nombre: { [Op.like]: `%${q}%` } },
                    { rut: { [Op.like]: `%${q}%` } }
                ]
            },
            limit: 5, // No saturar la lista
            raw: true
        });
        res.json(pacientes);
    } catch (error) {
        res.status(500).json([]);
    }
};