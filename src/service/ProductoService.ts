import { ProductoRepository } from "../data/ProductoRepository";
import { Producto } from "../models/Producto";

export class ProductoService {
    private repository = new ProductoRepository();

    async listar(): Promise<Producto[]> {
        return await this.repository.obtenerProductos();
    }

    async agregar(producto: Producto): Promise<void> {
        try {
            if (isNaN(producto.id) || isNaN(producto.precio) || isNaN(producto.stock)) {
                throw new Error("ID, precio y stock deben ser valores numéricos.");
            }

            if (!producto.nombre || !producto.descripcion || !producto.categoria) {
                throw new Error("Nombre, descripción y categoría son obligatorios.");
            }

            if (producto.precio <= 0) {
                throw new Error("El precio debe ser mayor a 0.");
            }

            if (producto.stock < 0) {
                throw new Error("El stock no puede ser negativo.");
            }

            const productos = await this.repository.obtenerProductos();

            const existe = productos.some(p => p.id === producto.id);
            if (existe) {
                throw new Error("Ya existe un producto con ese ID.");
            }

            productos.push(producto);
            await this.repository.guardarProductos(productos);
            console.log("Producto creado correctamente.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al crear el producto.");
        }
    }

    async actualizar(producto: Producto): Promise<void> {
        try {
            if (isNaN(producto.id) || isNaN(producto.precio) || isNaN(producto.stock)) {
                throw new Error("ID, precio y stock deben ser valores numéricos.");
            }

            if (!producto.nombre || !producto.descripcion || !producto.categoria) {
                throw new Error("Nombre, descripción y categoría son obligatorios.");
            }

            if (producto.precio <= 0) {
                throw new Error("El precio debe ser mayor a 0.");
            }

            if (producto.stock < 0) {
                throw new Error("El stock no puede ser negativo.");
            }

            const productos = await this.repository.obtenerProductos();
            const indice = productos.findIndex(p => p.id === producto.id);

            if (indice === -1) {
                throw new Error("El producto no existe.");
            }

            productos[indice] = producto;
            await this.repository.guardarProductos(productos);
            console.log("Producto actualizado.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al actualizar el producto.");
        }
    }

    async buscar(campo: string, valor: string): Promise<Producto[]> {
        try {
            const productos = await this.repository.obtenerProductos();
            const valorLower = valor.toLowerCase();
            return productos.filter(p => {
                switch (campo) {
                    case "id": return !isNaN(Number(valor)) && p.id === Number(valor);
                    case "nombre": return p.nombre.toLowerCase().includes(valorLower);
                    case "categoria": return p.categoria.toLowerCase().includes(valorLower);
                    case "precio_min": return !isNaN(Number(valor)) && p.precio >= Number(valor);
                    case "precio_max": return !isNaN(Number(valor)) && p.precio <= Number(valor);
                    default: return true;
                }
            });
        } catch (error) {
            console.log("Error al buscar.");
            return [];
        }
    }

    async eliminar(id: number): Promise<void> {
        try {
            if (isNaN(id)) {
                throw new Error("ID inválido.");
            }

            const productos = await this.repository.obtenerProductos();
            const nuevos = productos.filter(p => p.id !== id);

            if (nuevos.length === productos.length) {
                throw new Error("No se encontró un producto con ese ID.");
            }

            await this.repository.guardarProductos(nuevos);
            console.log("Producto eliminado.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al eliminar.");
        }
    }
}
