export interface BcvRate {
  fuente: string;
  nombre: string;
  compra: number;
  venta: number;
  promedio: number;
  fechaActualizacion: string;
}

export async function getBcvRate(): Promise<BcvRate> {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');

    if (!response.ok) {
      throw new Error(`Error al consultar Dólar BCV: Status ${response.status}`);
    }

    const data = await response.json();

    const promedio = Number(data.promedio) || Number(data.promedio) || Number(data.venta) || 36.5;

    return {
      fuente: data.fuente ?? 'oficial',
      nombre: data.nombre ?? 'Dólar BCV',
      compra: Number(data.compra) || promedio,
      venta: Number(data.venta) || promedio,
      promedio: promedio,
      fechaActualizacion: data.fechaActualizacion ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error en bcvService:', error);
    // Tasa de respaldo aproximada en caso de fallo de red
    return {
      fuente: 'oficial',
      nombre: 'Dólar BCV',
      compra: 36.5,
      venta: 36.5,
      promedio: 36.5,
      fechaActualizacion: new Date().toISOString(),
    };
  }
}