export const products = [
  {
    id: 'prod-1',
    name: 'Camiseta Algodón Perchado',
    category: 'Camisetas · Oversize',
    description: 'Algodón perchado de alta densidad con acabados premium - 260 gr. Diseñada en Bogotá con cortes oversize y cuello reforzado para mayor durabilidad.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80',
      'https://images.unsplash.com/photo-1622445275576-721655409e0d?w=900&q=80',
    ],
    variants: [
      { name: 'Negro', color: '#1a1a1a', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80' },
      { name: 'Blanco', color: '#f5f5f5', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80' },
      { name: 'Grape', color: '#8A2BE2', image: 'https://images.unsplash.com/photo-1622445275576-721655409e0d?w=900&q=80' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Algodón perchado heavyweight 260 gr. Acabados textiles premium con costuras reforzadas. Pre-lavado para evitar encogimiento.',
    reviews: [
      { author: 'Carlos M.', rating: 5, text: 'La calidad es excelente, la tela es gruesa y el corte oversize queda perfecto.' },
      { author: 'Andrea R.', rating: 4, text: 'Muy buena prenda, tal vez pediría una talla menos por el corte amplio.' },
    ],
  },
  {
    id: 'prod-2',
    name: 'Hoodies',
    category: 'Hoodies · Bordado digital',
    description: 'Hoodies de Algodón perchado con bordado digital de alta precisión. Capucha doble capa con cordones ajustables y bolsillo canguro frontal.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d933?w=900&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80',
    ],
    variants: [
      { name: 'Negro', color: '#1a1a1a', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80' },
      { name: 'Plum', color: '#310A5D', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d933?w=900&q=80' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Algodón perchado 320 gr con interior en pelusa. Bordado digital con hilos de alta resistencia. Cordones de algodón trenzado.',
    reviews: [
      { author: 'Sebastián P.', rating: 5, text: 'El bordado es increíble, se nota la calidad del detalle. Abrió muy bien.' },
      { author: 'Valeria T.', rating: 5, text: 'Es el mejor hoodie que he tenido, súper abrigado y el bordado no se desgasta.' },
    ],
  },
  {
    id: 'prod-3',
    name: 'Camiseta Básica',
    category: 'Camisetas · DTF',
    description: 'Aplicación gráfica con transfers DTF de máxima durabilidad, ideal para eventos o actividades. Tela ligera y transpirable para uso diario.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1576576574229-4f6e0f9cd9f2?w=500&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576576574229-4f6e0f9cd9f2?w=900&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=80',
      'https://images.unsplash.com/photo-1576576574229-4f6e0f9cd9f2?w=900&q=80',
    ],
    variants: [
      { name: 'Blanco', color: '#f5f5f5', image: 'https://images.unsplash.com/photo-1576576574229-4f6e0f9cd9f2?w=900&q=80' },
      { name: 'Negro', color: '#1a1a1a', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900&q=80' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    material: 'Algodón cardado 180 gr. Transfer DTF de alta durabilidad con colores vivos y resistentes al lavado. Cuello canalé reforzado.',
    reviews: [
      { author: 'Mariana G.', rating: 4, text: 'La gráfica se ve muy bien y no se ha borrado tras varios lavados.' },
    ],
  },
  {
    id: 'prod-4',
    name: 'Buzo Cuello Redondo',
    category: 'Buzos · Premium',
    description: 'Buzo premium de 300 gr de alta calidad. Cuello redondo reforzado y corte regular fit para comodidad diaria.',
    price: 90000,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc5e3a1e1?w=900&q=80',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80',
    ],
    variants: [
      { name: 'Negro', color: '#1a1a1a', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80' },
      { name: 'Grape', color: '#8A2BE2', image: 'https://images.unsplash.com/photo-1620012253295-c15cc5e3a1e1?w=900&q=80' },
      { name: 'Plum', color: '#310A5D', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    material: 'Algodón perchado heavyweight 300 gr. Interior suave con acabado premium. Costuras dobles en cuello, puños y bastilla.',
    reviews: [
      { author: 'David L.', rating: 5, text: 'Súper cómodo y abrigado, la tela es muy suave por dentro.' },
      { author: 'Laura F.', rating: 4, text: 'Buena calidad, me gustaría que tuviera más colores disponibles.' },
    ],
  },
]

export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
