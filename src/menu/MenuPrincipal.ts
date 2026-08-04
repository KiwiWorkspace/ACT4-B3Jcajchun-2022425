import { Estado } from "../models/Estado";
import { Rol } from "../models/Rol";
import { UsuarioService } from "../service/UsuarioService";
import { rl } from "../utils/Readline";
import { menuProducto } from "./MenuProducto";
import { menuProveedor } from "./MenuProveedor";

const service = new UsuarioService();

async function menuUsuarios() {
    while (true) {
        console.log("| USUARIOS |");
        console.log("\n1. Agregar");
        console.log("2. Listar");
        console.log("3. Buscar");
        console.log("4. Actualizar");
        console.log("5. Eliminar");
        console.log("6. Volver");

        const opcion = Number(await rl.question("Seleccione una opción: "));

        if (opcion === 6) break;

        try {
            switch (opcion) {
                case 1:
                    const id = Number(await rl.question("ID: "));
                    const nombre = await rl.question("Nombre: ");
                    const apellido = await rl.question("Apellido: ");
                    const edad = Number(await rl.question("Edad: "));
                    const correo = await rl.question("Correo: ");
                    const contrasena = Number(await rl.question("Contraseña: "));
                    const rolTexto = await rl.question("Rol: ");
                    const estadoTexto = await rl.question("Estado: ");

                    await service.agregar({
                        id,
                        nombre,
                        apellido,
                        edad,
                        correo,
                        contrasena,
                        rol: rolTexto.toUpperCase() as Rol,
                        estado: estadoTexto.toUpperCase() as Estado
                    });
                break;

                case 2:
                    console.table(await service.listar());
                break;

                case 3:
                    console.log("Filtrar por:");
                    console.log("1. ID");
                    console.log("2. Nombre");
                    console.log("3. Apellido");
                    console.log("4. Correo");
                    console.log("5. Rol");
                    console.log("6. Estado");
                    const filtro = Number(await rl.question("Seleccione filtro: "));
                    const valor = await rl.question("Valor: ");
                    const mapaFiltro: Record<number, string> = { 1: "id", 2: "nombre", 3: "apellido", 4: "correo", 5: "rol", 6: "estado" };
                    const resultados = await service.buscar(mapaFiltro[filtro] || "nombre", valor);
                    if (resultados.length === 0) {
                        console.log("No se encontraron resultados.");
                    } else {
                        console.table(resultados);
                    }
                break;

                case 4:
                    const idAct = Number(await rl.question("ID del usuario a actualizar: "));
                    const nombreAct = await rl.question("Nombre: ");
                    const apellidoAct = await rl.question("Apellido: ");
                    const edadAct = Number(await rl.question("Edad: "));
                    const correoAct = await rl.question("Correo: ");
                    const contrasenaAct = Number(await rl.question("Contraseña: "));
                    const rolAct = await rl.question("Rol: ");
                    const estadoAct = await rl.question("Estado: ");
                    await service.actualizar({
                        id: idAct,
                        nombre: nombreAct,
                        apellido: apellidoAct,
                        edad: edadAct,
                        correo: correoAct,
                        contrasena: contrasenaAct,
                        rol: rolAct.toUpperCase() as Rol,
                        estado: estadoAct.toUpperCase() as Estado
                    });
                break;

                case 5:
                    const idElim = Number(await rl.question("ID del usuario a eliminar: "));
                    await service.eliminar(idElim);
                break;
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }
}

export async function menuPrincipal() {
    while (true) {
        console.log("| MENÚ PRINCIPAL |");
        console.log("\n1. Usuarios");
        console.log("2. Productos");
        console.log("3. Proveedores");
        console.log("4. Salir");

        const opcion = Number(await rl.question("Seleccione un módulo: "));

        if (opcion === 4) break;

        switch (opcion) {
            case 1:
                await menuUsuarios();
            break;

            case 2:
                await menuProducto();
            break;

            case 3:
                await menuProveedor();
            break;
        }
    }
}
