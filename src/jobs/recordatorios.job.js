import { conectarDB } from "../models/index.js";
import { enviarRecordatorios } from "../services/recordatorio.service.js";

const iniciarJob = async () => {
  await conectarDB();
  await enviarRecordatorios();
  process.exit();
};

iniciarJob();