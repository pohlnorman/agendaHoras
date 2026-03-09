import Handlebars from 'handlebars'

//este es un helpers para la condicional IF dentro de las vistas.
export const helpers = Handlebars.registerHelper({
    eq: (v1, v2) => v1 === v2,
    ne: (v1, v2) => v1 !== v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    contains: function(array, value) {
        return array && array.includes(value);
    },
    // ✅ Nuevo helper para convertir a JSON literal
    json: function (context) {
        return JSON.stringify(context);
    },
    formatRut: (rut) => {
        if (!rut) return '';
        let cuerpo = rut.slice(0, -1);
        let dv = rut.slice(-1);
    
        // Agrega puntos cada 3 dígitos
        cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
        return `${cuerpo}-${dv}`;
    },
});
