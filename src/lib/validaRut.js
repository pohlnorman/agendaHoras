/**
 * Limpia el RUT de puntos y guiones y lo pasa a mayúsculas
 */
export const limpiarRut = (rut) => {
  if (typeof rut !== 'string') return '';
  return rut.replace(/[.-]/g, '').toUpperCase();
};

/**
 * Valida el algoritmo del RUT (Módulo 11)
 */
export const validarRut = (rut) => {
  if (!rut) return false;
  
  const limpio = limpiarRut(rut);
  let cuerpo = limpio.slice(0, -1);
  let dv = limpio.slice(-1);

  if (cuerpo.length < 7) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = 1; cuerpo.length - i >= 0; i++) {
    suma += multiplo * cuerpo.charAt(cuerpo.length - i);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dvEsperado === dv;
};