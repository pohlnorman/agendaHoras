import { DataTypes } from "sequelize";
import db from '../config/conecction.js';
import Cita from "./cita.model.js";

  const Notificacion =  db.define("Notificacion", {
    tipo: {
      type: DataTypes.ENUM("email", "sms","whatsapp"),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("enviado", "error"),
      allowNull: false,
    },
    fecha_envio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    mensaje_error: {
      type: DataTypes.TEXT,
    },
  });

    // Definimos las relaciones aquí mismo
Cita.hasMany(Notificacion, {foreignKey: 'citaId', onDelete: 'CASCADE'});
Notificacion.belongsTo(Cita,{foreignKey: 'citaId'})


export default Notificacion;