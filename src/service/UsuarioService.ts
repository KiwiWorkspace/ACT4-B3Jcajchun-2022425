import { UsuarioRepository } from "../data/UsuarioRepository";
import { Usuario } from "../models/Usuario";

export class UsuarioService {
    private repository = new UsuarioRepository();

    async listar(): Promise<Usuario[]> {
        return await this.repository.obtenerUsuarios();
    }

    async agregar(usuario: Usuario): Promise<void> {
        try {
            if (isNaN(usuario.id) || isNaN(usuario.edad) || isNaN(usuario.contrasena)) {
                throw new Error("ID, edad y contraseña deben ser valores numéricos.");
            }

            if (!usuario.nombre || !usuario.apellido || !usuario.correo) {
                throw new Error("Nombre, apellido y correo son obligatorios.");
            }

            if (usuario.edad < 0 || usuario.edad > 150) {
                throw new Error("Edad inválida.");
            }

            const usuarios = await this.repository.obtenerUsuarios();

            const existe = usuarios.some(u => u.id === usuario.id);

            if (existe) {
                throw new Error("Ya existe un usuario con ese ID.");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(usuario.correo)) {
                throw new Error("Correo inválido. Debe tener el formato: usuario@dominio.com");
            }

            usuarios.push(usuario);

            await this.repository.guardarUsuarios(usuarios);

            console.log("Usuarios creado correctamente.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al crear el usuario.");
        }
    }

    async buscar(campo: string, valor: string): Promise<Usuario[]> {
        try {
            const usuarios = await this.repository.obtenerUsuarios();
            const valorLower = valor.toLowerCase();
            return usuarios.filter(u => {
                switch (campo) {
                    case "id": return !isNaN(Number(valor)) && u.id === Number(valor);
                    case "nombre": return u.nombre.toLowerCase().includes(valorLower);
                    case "apellido": return u.apellido.toLowerCase().includes(valorLower);
                    case "correo": return u.correo.toLowerCase().includes(valorLower);
                    case "rol": return u.rol.toLowerCase().includes(valorLower);
                    case "estado": return u.estado.toLowerCase().includes(valorLower);
                    default: return true;
                }
            });
        } catch (error) {
            console.log("Error al buscar.");
            return [];
        }
    }

    async login(correo: string, contrasena: number): Promise<Usuario | null> {
        try {
            const usuarios = await this.repository.obtenerUsuarios();
            const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
            return usuario ?? null;
        } catch (error) {
            console.log("Error al iniciar sesión.");
            return null;
        }
    }

    async actualizar(usuario: Usuario): Promise<void> {
        try {
            if (isNaN(usuario.id) || isNaN(usuario.edad) || isNaN(usuario.contrasena)) {
                throw new Error("ID, edad y contraseña deben ser valores numéricos.");
            }

            if (!usuario.nombre || !usuario.apellido || !usuario.correo) {
                throw new Error("Nombre, apellido y correo son obligatorios.");
            }

            if (usuario.edad < 0 || usuario.edad > 150) {
                throw new Error("Edad inválida.");
            }

            const usuarios = await this.repository.obtenerUsuarios();

            const indice = usuarios.findIndex(u => u.id === usuario.id);

            if (indice === -1) {
                throw new Error("El usuario no existe.");
            }

            usuarios[indice] = usuario;

            await this.repository.guardarUsuarios(usuarios);

            console.log("Usuario Actualizado.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al actualizar el usuario.");
        }
    }

    async eliminar(id: number): Promise<void> {
        try {
            if (isNaN(id)) {
                throw new Error("ID inválido.");
            }

            const usuarios = await this.repository.obtenerUsuarios();

            const nuevos = usuarios.filter(u => u.id !== id);

            if (nuevos.length === usuarios.length) {
                throw new Error("No se encontró un usuario con ese ID.");
            }

            await this.repository.guardarUsuarios(nuevos);

            console.log("Usuario eliminado.");
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("Error al eliminar.");
        }
    }
}