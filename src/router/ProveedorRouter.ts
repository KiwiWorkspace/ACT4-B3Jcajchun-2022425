import { IncomingMessage, ServerResponse } from "http";
import { ProveedorService } from "../service/ProveedorService";

const service = new ProveedorService();

export async function routes(req: IncomingMessage, res: ServerResponse) {

    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {

        // GET | Listar Proveedores
        if (metodo === "GET" && url === "/proveedores") {

            const proveedores = await service.listar();

            res.writeHead(200);

            res.end(JSON.stringify(proveedores));

            return;
        }

        // POST | Agregar Proveedores
        if (metodo === "POST" && url === "/proveedores/crear") {
            let body = "";

            req.on("data", chunk => {
                body += chunk;
            });

            req.on("end", async () => {
                try {

                    const proveedor = JSON.parse(body);

                    await service.agregar(proveedor);

                    res.writeHead(201);

                    res.end(JSON.stringify({
                        mensaje: "Proveedor agregado correctamente."
                    }));

                } catch (error) {

                    res.writeHead(400);

                    res.end(JSON.stringify({
                        mensaje: (error as Error).message
                    }));
                }
            })
        }

        // PUT | Actualizar Proveedores
        if (metodo === "PUT" && url.startsWith("/proveedores/actualizar")) {
            const idStr = url.split("/")[3];
            const id = Number(idStr);

            let body = "";
            req.on("data", chunk => {
                body += chunk;
            });

            req.on("end", async () => {
                try {
                    const datosActualizados = JSON.parse(body);
                    await service.actualizar({ ...datosActualizados, id });

                    res.writeHead(200);
                    res.end(JSON.stringify({
                        mensaje: "Proveedor actualizado correctamente."
                    }));
                } catch (error) {
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        mensaje: (error as Error).message
                    }));
                }
            });
            return;
        }

        // DELETE | Eliminar Proveedores
        if (metodo === "DELETE" && url.startsWith("/proveedores/eliminar")) {
            const idStr = url.split("/")[3];
            const id = Number(idStr);

            try {
                await service.eliminar(id);

                res.writeHead(200);
                res.end(JSON.stringify({
                    mensaje: "Proveedor eliminado correctamente."
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    mensaje: (error as Error).message
                }));
            }
            return;
        }

    } catch (error) {
        res.writeHead(500);

        res.end(JSON.stringify({
            mensaje: (error as Error).message
        }));

    }
}
