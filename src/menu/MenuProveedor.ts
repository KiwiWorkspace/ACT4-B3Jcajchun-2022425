import { ProveedorService } from "../service/ProveedorService";
import { rl } from "../utils/Readline";

const service = new ProveedorService();

export async function menuProveedor() {
    while (true) {
        console.log("| PROVEEDORES |");
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
                    const contacto = await rl.question("Contacto: ");
                    const telefono = await rl.question("Teléfono: ");
                    const direccion = await rl.question("Dirección: ");
                    const email = await rl.question("Email: ");

                    await service.agregar({ id, nombre, contacto, telefono, direccion, email });
                break;

                case 2:
                    console.table(await service.listar());
                break;

                case 3:
                    console.log("Filtrar por:");
                    console.log("1. ID");
                    console.log("2. Nombre");
                    console.log("3. Contacto");
                    console.log("4. Teléfono");
                    console.log("5. Email");
                    const filtro = Number(await rl.question("Seleccione filtro: "));
                    const valor = await rl.question("Valor: ");
                    const mapaFiltro: Record<number, string> = { 1: "id", 2: "nombre", 3: "contacto", 4: "telefono", 5: "email" };
                    const resultados = await service.buscar(mapaFiltro[filtro] || "nombre", valor);
                    if (resultados.length === 0) {
                        console.log("No se encontraron resultados.");
                    } else {
                        console.table(resultados);
                    }
                break;

                case 4:
                    const idAct = Number(await rl.question("ID del proveedor a actualizar: "));
                    const nombreAct = await rl.question("Nombre: ");
                    const contactoAct = await rl.question("Contacto: ");
                    const telefonoAct = await rl.question("Teléfono: ");
                    const direccionAct = await rl.question("Dirección: ");
                    const emailAct = await rl.question("Email: ");

                    await service.actualizar({ id: idAct, nombre: nombreAct, contacto: contactoAct, telefono: telefonoAct, direccion: direccionAct, email: emailAct });
                break;

                case 5:
                    const idElim = Number(await rl.question("ID del proveedor a eliminar: "));
                    await service.eliminar(idElim);
                break;
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }
}
