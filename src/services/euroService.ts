export interface EuroRate {
  fuente: string;
  nombre: string;
  compra: number;
  venta: number;
  promedio: number;
  fechaActualizacion: string;
}

export async function getEuroRate(): Promise<EuroRate> {
  try {
    const response = await fetch('https://ve.dolarapi.com/v1/euros/oficial');

    if (!response.ok) {
      throw new Error(`Error al consultar Euro BCV: Status ${response.status}`);
    }

    const data = await response.json();

    const promedio = Number(data.promedio) || Number(data.venta) || 39.8;

    return {
      fuente: data.fuente ?? 'oficial',
      nombre: data.nombre ?? 'Euro BCV',
      compra: Number(data.compra) || promedio,
      venta: Number(data.venta) || promedio,
      promedio: promedio,
      fechaActualizacion: data.fechaActualizacion ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error en euroService:', error);
    return {
      fuente: 'oficial',
      nombre: 'Euro BCV',
      compra: 39.8,
      venta: 39.8,
      promedio: 39.8,
      fechaActualizacion: new Date().toISOString(),
    };
  }
}