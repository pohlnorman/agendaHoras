import  Cita from "../models/cita.model.js";
import Paciente from "../models/paciente.model.js";

export const renderAgenda = (req, res) => {

  res.render('agenda/agenda');

};


export const obtenerEventos = async (req, res) => {

  try {

    const citas = await Cita.findAll({
      include: {
        model: Paciente
      },
      raw: true,
      nest: true
    });
    console.log("PRIMERA CITA ENCONTRADA:", JSON.stringify(citas[0], null, 2));
    const eventos = citas.map(({ id, Paciente, fecha, hora }) => ({
      id,
      title: Paciente.nombre ? Paciente.nombre : 'Paciente sin nombre',
      start: `${fecha}T${hora}`
    }));
    console.log("eventos",eventos)
    res.json(eventos);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Error al cargar citas' });

  }

};

export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    await Cita.destroy({ where: { id } });
    
    // IMPORTANTE: Devolvemos un estado 200 en lugar de redireccionar
    res.status(200).json({ message: 'Cita eliminada con éxito' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo eliminar la cita' });
  }
};