import express from 'express';
import morgan from 'morgan';
import exphbs from 'express-handlebars';
import path,{ dirname } from 'path';
import { fileURLToPath } from 'url';

import cron from 'node-cron';
import { enviarRecordatoriosManana } from './src/services/notificacion.service.js';

// IMPORTANTE: Importamos la conexión y los modelos directamente
import db from './src/config/conecction.js';
import Notificacion from './src/models/notificacion.model.js';
import Cita from './src/models/cita.model.js';
import Paciente from './src/models/paciente.model.js';


import pacienteRoutes from "./src/routes/paciente.route.js";
import citaRoutes from "./src/routes/cita.route.js";
import agendaRoutes from './src/routes/agenda.route.js';
import historialRoutes from './src/routes/historial.route.js'
import notificacionRoutes from './src/routes/notificaciones.route.js'

import {helpers} from './src/lib/handlebars.js';

const app = express();

const PORT = process.env.PORT || 3000; // 1. Definimos la constante aquí

//creamos una variable para la ruta absoluta del proyecto
export const __dirname = dirname(fileURLToPath(import.meta.url))

//confugiracion handlebars (handlebars es un motor de plantillas)
app.set('views', path.join(__dirname, 'src/views')); //definimos la ruta a la carpeta views para handlebars
app.engine('.hbs',exphbs.engine({
    defaultLayout:'main', //nombre del layout principal,plantilla base
    layoutsDir: path.join(app.get('views'), 'layouts'), //ubicacion del layout principal
    partialsDir: path.join(app.get('views'), 'partials'), //ubicacion de los modulos comunes
    extname:'.hbs', //extension de las vistas
    helpers: helpers //auxiliar para funsiones handlebars
}));
app.set('view engine','.hbs');//aqui, le indicamos a nuestra aplicacion que usaremos handlebars

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));//Esta línea permite aceptar datos enviados a través de formularios HTML.
app.use(express.json());//Esta línea permite manejar datos en formato JSON.

//variables globales
app.use((req, res, next) => {
    next();
})

// Programar para que corra todos los días a las 09:00 AM
cron.schedule('0 10 * * *', () => {
    console.log('Iniciando envío de recordatorios diarios...');
    enviarRecordatoriosManana();
});

//rutas
app.get("/", (req, res) => {
    res.render("index")
});
app.use("/pacientes", pacienteRoutes);
app.use("/citas", citaRoutes);
app.use('/agenda', agendaRoutes);
app.use('/historial', historialRoutes);
app.use('/notificaciones', notificacionRoutes);

//archivos publicos
app.use(express.static(path.join(__dirname, 'src/public')));

//Aqui iniciamos el servidor
async function main() {
    try {
        // Esto sincroniza TODOS los modelos importados que usen la instancia 'db'
        await db.sync({ force: true });
        console.log("Base de datos sincronizada correctamente");

        app.listen(PORT, () => {
            console.log(`---Servidor corriendo en http://localhost:${PORT}---`);
        });
    } catch (error) {
        console.error('error en la conexion a la base de datos:', error);
    }
}

await main();