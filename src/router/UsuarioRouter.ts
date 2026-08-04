import { IncomingMessage, ServerResponse } from "http";
import { UsuarioService } from "../service/UsuarioService";

const service = new UsuarioService();

export async function routes(req: IncomingMessage, res: ServerResponse) {

    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "";
    const metodo = req.method ?? "";

    try {

        // GET | Listar Usuarios
        if (metodo === "GET" && url === "/usuarios") {

            const usuarios = await service.listar();

            res.writeHead(200);

            res.end(JSON.stringify(usuarios));

            return;
        }

        // POST | Agregar Usuarios
        if (metodo === "POST" && url === "/usuarios/crear") {
            let body = "";

            req.on("data", chunk => {
                body += chunk;
            });

            req.on("end", async () => {
                try {

                    const usuario = JSON.parse(body);

                    await service.agregar(usuario);

                    res.writeHead(201);

                    res.end(JSON.stringify({
                        mensaje: "Usuario agregado correctamente."
                    }));

                } catch (error) {

                    res.writeHead(400);

                    res.end(JSON.stringify({
                        mensaje: (error as Error).message
                    }));
                }
            })
        }

        // PUT | Actualizar Usuarios
        if (metodo === "PUT" && url.startsWith("/usuarios/actualizar")) {
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
                        mensaje: "Usuario actualizado correctamente."
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

        // DELETE | Eliminar Usuarios
        if (metodo === "DELETE" && url.startsWith("/usuarios/eliminar")) {
            const idStr = url.split("/")[3];
            const id = Number(idStr);

            try {
                await service.eliminar(id);

                res.writeHead(200);
                res.end(JSON.stringify({
                    mensaje: "Usuario eliminado correctamente."
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
