// public/js/calendar-config.js
let calendar; // Declarada aquí arriba para que sea global
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');

    if (!calendarEl) return; // Seguridad por si la vista no tiene el div #calendar

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',
        firstDay: 1,

    headerToolbar: window.innerWidth < 768 ? {
        left: 'prev,next',
        center: 'title',
        right: 'timeGridDay' // En móvil es mejor ver solo el día
    } : {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    handleWindowResize: true,
    windowResize: function(arg) {
        if (window.innerWidth < 768) {
            calendar.changeView('timeGridDay');
        } else {
            calendar.changeView('timeGridWeek');
        }
    },

        
        // --- CONFIGURACIÓN DE TIEMPOS ---
        slotMinTime: "08:00:00",
        slotMaxTime: "24:00:00",
        
        // ✅ Ajustes de precisión
        height: 'auto',          // El calendario se estira según el contenido, no se comprime
        handleWindowResize: true,
        expandRows: true,        // Fuerza a que todas las filas midan exactamente lo mismo
        stickyHeaderDates: true, // Mantiene la fecha arriba al hacer scroll
        displayEventEnd: false,
        // ✅ Asegura que el clic sea preciso en los 30 min
        snapDuration: '00:30:00',
        allDaySlot: false, // Opcional: quita la fila superior de "todo el día" para ganar espacio
        
        // ✅ SOLUCIÓN AL PROBLEMA DE LOS 60 MINUTOS
        // Esto hace que si el evento no tiene 'end', dure solo 30 min
        defaultTimedEventDuration: '00:30:00',
        forceEventDuration: true,

        // ✅ Configura el formato de hora del evento: "10:30" (sin hora de fin)
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
        },

        // ✅ Asegura que el texto no se corte y se vea limpio
        eventDisplay: 'block',

        // --- FUENTE DE DATOS ---
        events: '/agenda/events',

        // --- ACCIONES ---
        dateClick: function(info) {
            const partes = info.dateStr.split('T');
            const fecha = partes[0];
            // Extraer hora si existe, si no dejar vacío
            const hora = partes[1] ? partes[1].substring(0, 5) : '';
            
            window.location.href = `/citas/crear?fecha=${fecha}&hora=${hora}`;
        },

        eventClick: function(info) {
            const id = info.event.id;
            const nombrePaciente = info.event.title;
            const hora = info.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            Swal.fire({
                title: `Cita: ${nombrePaciente}`,
                text: `Hora programada: ${hora}`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cerrar',
                confirmButtonColor: '#d33',
                denyButtonColor: '#6c757d',
            }).then((result) => {
                if (result.isConfirmed) {
                    confirmarEliminacion(id);
                }
            });
        },

        // --- APARIENCIA ---
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        buttonText: {
            today:    'Hoy',
            month:    'Mes',
            week:     'Semana',
            day:      'Día'
        }
    });

    calendar.render();
});

/* function confirmarEliminacion(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Enviamos un formulario POST o usamos fetch para eliminar
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/citas/eliminar/${id}`; // Asegúrate que esta ruta exista en tus rutas
            document.body.appendChild(form);
            form.submit();
        }
    });
} */

    function confirmarEliminacion(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la cita permanentemente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Usamos fetch en lugar de crear un formulario manual
            fetch(`/agenda/citas/eliminar/${id}`, {
                method: 'POST' // O 'DELETE' según como lo tengas en tus rutas
            })
            .then(response => {
                if (response.ok) {
                    // Alerta de éxito
                    Swal.fire({
                        toast: true,
                        position: 'bottom-end',
                        icon:'warning',
                        title:'¡Cita eliminada!',
                        showConfirmButton: false, // Ocultamos el botón de confirmación
                        timer: 1500, // El SweetAlert se cierra automáticamente después de 1.5 segundos
                        timerProgressBar: true,
                        width: '300px',
                        padding: '0.5rem',
                        background: '#d33',
                        color: '#ffffff',  
                        didOpen: (toast) => {
                            // Esto cambia el color de la barra de progreso a blanco semi-transparente
                            const progress = toast.querySelector('.swal2-timer-progress-bar');
                            if (progress) progress.style.backgroundColor = 'rgba(255,255,255,0.7)';
                        }
                    }
                        
                    );
                    
                    // ACTUALIZAR EL CALENDARIO SIN RECARGAR
                    // Esto asume que tu objeto se llama 'calendar'
                    if (typeof calendar !== 'undefined') {
                        calendar.refetchEvents();
                    } else {
                        // Si no logras acceder a la variable calendar, 
                        // esta es la alternativa para refrescar la página:
                        location.reload(); 
                    }
                } else {
                    Swal.fire('Error', 'No se pudo eliminar la cita', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error', 'Ocurrió un error en el servidor', 'error');
            });
        }
    });
}