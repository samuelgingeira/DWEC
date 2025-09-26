export function crearProducto(nombre, categoria, precio, stock) {
  return { nombre, categoria, precio, stock };
}


export function filtrarPorCategoria(inventario, categoria) {
  return inventario.filter(p => p.categoria === categoria);
}


export function listarProductosAgotados(inventario) {
  return inventario.filter(p => p.stock === 0);
}


export function calcularValorTotalInventario(inventario) {
  return inventario.reduce((total, p) => total + (p.precio * p.stock), 0);
}


export default function resumenInventario(inventario) {
  const totalProductos = inventario.length;
  const categorias = new Set(inventario.map(p => p.categoria));
  const valorTotal = calcularValorTotalInventario(inventario);

  console.log("📦 Resumen del Inventario:");
  console.log(`Total de productos: ${totalProductos}`);
  console.log(`Categorías distintas: ${categorias.size}`);
  console.log(`Valor total: $${valorTotal}`);
}