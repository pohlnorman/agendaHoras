import Cita from "../models/cita.model.js";

export const renderHistorial = (req, res) => {
    res.render('historial/ver'); // Renderiza la vista base
};

export const obtenerHistorialPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const citas = await Cita.findAll({
            where: { pacienteId: id },
            order: [['fecha', 'DESC'], ['hora', 'DESC']], // Lo más reciente primero
            raw: true
        });
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
};