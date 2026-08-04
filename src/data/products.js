export const products = [
  {
    id: 'c121-tee-obsidian',
    name: 'Tee Oversize Obsidian',
    price: 89000,
    category: 'Camisetas',
    image:
      'https://images.pexels.com/photos/1654688/pexels-photo-1654688.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Camiseta oversize de algodón pesado 240g. Corte drop-shoulder.',
  },
  {
    id: 'c121-hoodie-violet',
    name: 'Hoodie Violet Bogotá',
    price: 179000,
    category: 'Hoodies',
    image:
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Hoodie premium con interior afelpado y bordado pecho.',
  },
  {
    id: 'c121-tee-gracia',
    name: 'Tee Gracia Purpose',
    price: 95000,
    category: 'Camisetas',
    image:
      'https://images.pexels.com/photos/8217362/pexels-photo-8217362.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Camiseta con print "Viste con propósito". Algodón orgánico.',
  },
  {
    id: 'c121-jacket-avenida',
    name: 'Jacket Avenida 26',
    price: 249000,
    category: 'Chaquetas',
    image:
      'https://images.pexels.com/photos/1182057/pexels-photo-1182057.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Chaqueta técnica urbana, capucha ajustable y bolsillos cargo.',
  },
  {
    id: 'c121-tee-testimonio',
    name: 'Tee Testimonio',
    price: 89000,
    category: 'Camisetas',
    image:
      'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Edición limitada. Print trasero con la firma de la marca.',
  },
  {
    id: 'c121-pants-urban',
    name: 'Pants Urban Grace',
    price: 159000,
    category: 'Pantalones',
    image:
      'https://images.pexels.com/photos/4380970/pexels-photo-4380970.jpeg?auto=compress&cs=tinysrgb&w=900',
    description: 'Pantalón cargo de tiro bajo, tela ripstop ligera.',
  },
]

export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
