import { DataTypes } from "sequelize";
import db from '../config/conecction.js';
import Paciente from './paciente.model.js'; // Importamos para la relación


  const Cita = db.define("Cita", {
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("agendada", "cancelada", "realizada"),
      defaultValue: "agendada",
    },
    recordatorio_enviado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    observacion: {
      type: DataTypes.TEXT,
    },
  });

  // Definimos las relaciones aquí mismo
Paciente.hasMany(Cita, { foreignKey: 'pacienteId', onDelete: 'CASCADE' });
Cita.belongsTo(Paciente, { foreignKey: 'pacienteId' });


export default Cita;