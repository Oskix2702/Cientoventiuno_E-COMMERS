export const products = [
  {
    id: 'prod-1',
    name: 'Camiseta Algodón Perchado',
    description: 'Algodón perchado de alta densidad con acabados premium - 260 gr.',
    price: 75000,
    image: '/assets/products/prod-1.png',
  },
  {
    id: 'prod-2',
    name: 'Hoodies',
    description: 'Hoodies de Algodón perchado con bordado digital de alta precisión.',
    price: 120000,
    image: '/assets/products/prod-2.png',
  },
  {
    id: 'prod-3',
    name: 'Camiseta Básica',
    description: 'Aplicación gráfica con transfers DTF de máxima durabilidad, ideal para eventos o actividades.',
    price: 40000,
    image: '/assets/products/prod-3.png',
  },
  {
    id: 'prod-4',
    name: 'Buzo Cuello Redondo',
    description: 'Buzo premium - 300 gr de alta calidad',
    price: 90000,
    image: '/assets/products/prod-4.png',
  },
]

export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)


export { formatCOP }