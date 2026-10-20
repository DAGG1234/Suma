export interface UsdtRate {
  fuente: string;
  nombre: string;
  promedio: number;
  fechaActualizacion: string;
}

export const getUsdtRate = async (): Promise<UsdtRate> => {
  try {
    // Consultamos el paralelo para USDT / Paralelo
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/paralelo');

    if (response.ok) {
      const data = await response.json();
      const price = Number(data.promedio) || Number(data.venta);
      if (price && price > 0) {
        return {
          fuente: 'paralelo',
          nombre: 'USDT / Paralelo',
          promedio: price,
          fechaActualizacion: data.fechaActualizacion ?? new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('Error al conectar con servicio USDT, usando tasa de respaldo.');
  }

  // Tasa de respaldo por si no hay conexión
  return {
    fuente: 'paralelo',
    nombre: 'USDT / Paralelo',
    promedio: 38.0,
    fechaActualizacion: new Date().toISOString(),
  };
};