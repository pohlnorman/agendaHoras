import { DataTypes } from "sequelize";
import db from '../config/conecction.js';
import { limpiarRut, validarRut } from "../lib/validaRut.js";


  const Paciente = db.define("Paciente", {
    rut: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(val) {
        // Limpia automáticamente antes de guardar
        this.setDataValue('rut', limpiarRut(val));
      },
      validate: {
        isRutValid(value){
          if (!validarRut(value)){
            throw new Error('El RUT ingresado no es valido')
          }
        }
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.STRING,
    },
    recordatorio_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    recordatorio_sms: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });


export default Paciente;