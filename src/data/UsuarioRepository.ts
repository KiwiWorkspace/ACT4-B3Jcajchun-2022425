import { readFile, writeFile } from "fs/promises";  
import { Usuario } from "../models/Usuario";

export class UsuarioRepository {
    // Dar la ruta de doden se almacenara mi archivo JSON
    private ruta = "./src/data/usuarios.json";

    // Método para obtener usuarios | mostar datos
    async obtenerUsuarios(): Promise<Usuario[]> {
        try {
            const datos = await readFile(this.ruta, "utf-8");

            return JSON.parse(datos);            
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    // Método para guardar usuarios | escribir datos
    async guardarUsuarios(usuario: Usuario[]): Promise<void> {
        try {
            await writeFile(
                this.ruta,
                JSON.stringify(usuario, null, 4)
            );

        } catch (error) {
            console.log(error);
        }
    }
}