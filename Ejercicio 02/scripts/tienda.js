import resumenInventario, { crearProducto, filtrarPorCategoria, listarProductosAgotados, calcularValorTotalInventario } from "./inventario.js";

const inventario = [];


inventario.push(crearProducto("Laptop", "Electrónica", 1200, 5));
inventario.push(crearProducto("Camiseta", "Ropa", 20, 10));
inventario.push(crearProducto("Pantalón", "Ropa", 30, 0));
inventario.push(crearProducto("Libro JS", "Libros", 15, 8));
inventario.push(crearProducto("Auriculares", "Electrónica", 50, 3));
inventario.push(crearProducto("Zapatos", "Ropa", 40, 2));


console.log("👕 Productos de Ropa:", filtrarPorCategoria(inventario, "Ropa"));


console.log("❌ Productos agotados:", listarProductosAgotados(inventario));


console.log("💰 Valor total:", calcularValorTotalInventario(inventario));


resumenInventario(inventario);