import { readFile, writeFile } from "fs/promises";
import { Proveedor } from "../models/Proveedor";

export class ProveedorRepository {
    private ruta = "./src/data/proveedores.json";

    async obtenerProveedores(): Promise<Proveedor[]> {
        try {
            const datos = await readFile(this.ruta, "utf-8");
            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    async guardarProveedores(proveedores: Proveedor[]): Promise<void> {
        try {
            await writeFile(this.ruta, JSON.stringify(proveedores, null, 4));
        } catch (error) {
            console.log(error);
        }
    }
}
