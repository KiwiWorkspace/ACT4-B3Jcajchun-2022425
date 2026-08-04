import { ProductoService } from "../service/ProductoService";
import { rl } from "../utils/Readline";

const service = new ProductoService();

export async function menuProducto() {
    while (true) {
        console.log("| PRODUCTOS |");
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
                    const descripcion = await rl.question("Descripción: ");
                    const precio = Number(await rl.question("Precio: "));
                    const stock = Number(await rl.question("Stock: "));
                    const categoria = await rl.question("Categoría: ");

                    await service.agregar({ id, nombre, descripcion, precio, stock, categoria });
                break;

                case 2:
                    console.table(await service.listar());
                break;

                case 3:
                    console.log("Filtrar por:");
                    console.log("1. ID");
                    console.log("2. Nombre");
                    console.log("3. Categoría");
                    console.log("4. Precio mínimo");
                    console.log("5. Precio máximo");
                    const filtro = Number(await rl.question("Seleccione filtro: "));
                    const valor = await rl.question("Valor: ");
                    const mapaFiltro: Record<number, string> = { 1: "id", 2: "nombre", 3: "categoria", 4: "precio_min", 5: "precio_max" };
                    const resultados = await service.buscar(mapaFiltro[filtro] || "nombre", valor);
                    if (resultados.length === 0) {
                        console.log("No se encontraron resultados.");
                    } else {
                        console.table(resultados);
                    }
                break;

                case 4:
                    const idAct = Number(await rl.question("ID del producto a actualizar: "));
                    const nombreAct = await rl.question("Nombre: ");
                    const descripcionAct = await rl.question("Descripción: ");
                    const precioAct = Number(await rl.question("Precio: "));
                    const stockAct = Number(await rl.question("Stock: "));
                    const categoriaAct = await rl.question("Categoría: ");

                    await service.actualizar({ id: idAct, nombre: nombreAct, descripcion: descripcionAct, precio: precioAct, stock: stockAct, categoria: categoriaAct });
                break;

                case 5:
                    const idElim = Number(await rl.question("ID del producto a eliminar: "));
                    await service.eliminar(idElim);
                break;
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }
}
