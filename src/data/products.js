export const products = [
  {
    id: 'prod-1',
    name: 'Camiseta Algodón Perchado',
    description: 'Algodón perchado de alta densidad con acabados premium - 260 gr.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
  },
  {
    id: 'prod-2',
    name: 'Hoodies',
    description: 'Hoodies de Algodón perchado con bordado digital de alta precisión.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
  },
  {
    id: 'prod-3',
    name: 'Camiseta Básica',
    description: 'Aplicación gráfica con transfers DTF de máxima durabilidad, ideal para eventos o actividades.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1576576574229-4f6e0f9cd9f2?w=500&q=80',
  },
  {
    id: 'prod-4',
    name: 'Buzo Cuello Redondo',
    description: 'Buzo premium - 300 gr de alta calidad',
    price: 90000,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
  },
]

export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)