import { ProveedorRepository } from "../data/ProveedorRepository";
import { Proveedor } from "../models/Proveedor";

export class ProveedorService {
    private repository = new ProveedorRepository();

    async listar(): Promise<Proveedor[]> {
        return await this.repository.obtenerProveedores();
    }

    async agregar(proveedor: Proveedor): Promise<void> {
        try {
            if (isNaN(proveedor.id)) {
                throw new Error("ID debe ser un valor numérico.");
            }

            if (!proveedor.nombre || !proveedor.contacto || !proveedor.direccion || !proveedor.email) {
                throw new Error("Nombre, contacto, dirección y email son obligatorios.");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(proveedor.email)) {
                throw new Error("Email inválido.");
            }

            const proveedores = await this.repository.obtenerProveedores();

            const existe = proveedores.some(p => p.id === proveedor.id);
            if (existe) {
                throw new Error("Ya existe un proveedor con ese ID.");
            }

            proveedores.push(proveedor);
            await this.repository.guardarProveedores(proveedores);
            console.log("Proveedor creado correctamente.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al crear el proveedor.");
        }
    }

    async actualizar(proveedor: Proveedor): Promise<void> {
        try {
            if (isNaN(proveedor.id)) {
                throw new Error("ID debe ser un valor numérico.");
            }

            if (!proveedor.nombre || !proveedor.contacto || !proveedor.direccion || !proveedor.email) {
                throw new Error("Nombre, contacto, dirección y email son obligatorios.");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(proveedor.email)) {
                throw new Error("Email inválido.");
            }

            const proveedores = await this.repository.obtenerProveedores();
            const indice = proveedores.findIndex(p => p.id === proveedor.id);

            if (indice === -1) {
                throw new Error("El proveedor no existe.");
            }

            proveedores[indice] = proveedor;
            await this.repository.guardarProveedores(proveedores);
            console.log("Proveedor actualizado.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al actualizar el proveedor.");
        }
    }

    async buscar(campo: string, valor: string): Promise<Proveedor[]> {
        try {
            const proveedores = await this.repository.obtenerProveedores();
            const valorLower = valor.toLowerCase();
            return proveedores.filter(p => {
                switch (campo) {
                    case "id": return !isNaN(Number(valor)) && p.id === Number(valor);
                    case "nombre": return p.nombre.toLowerCase().includes(valorLower);
                    case "contacto": return p.contacto.toLowerCase().includes(valorLower);
                    case "telefono": return p.telefono.includes(valor);
                    case "email": return p.email.toLowerCase().includes(valorLower);
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

            const proveedores = await this.repository.obtenerProveedores();
            const nuevos = proveedores.filter(p => p.id !== id);

            if (nuevos.length === proveedores.length) {
                throw new Error("No se encontró un proveedor con ese ID.");
            }

            await this.repository.guardarProveedores(nuevos);
            console.log("Proveedor eliminado.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al eliminar.");
        }
    }
}
