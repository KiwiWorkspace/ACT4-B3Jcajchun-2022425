import { createServer } from "http";
import { routes as usuarioRoutes } from "../router/UsuarioRouter";
import { routes as productoRoutes } from "../router/ProductoRouter";
import { routes as proveedorRoutes } from "../router/ProveedorRouter";

const servidor = createServer(async (req, res) => {
    const url = req.url ?? "";

    if (url.startsWith("/usuarios")) {
        await usuarioRoutes(req, res);
        return;
    }

    if (url.startsWith("/productos")) {
        await productoRoutes(req, res);
        return;
    }

    if (url.startsWith("/proveedores")) {
        await proveedorRoutes(req, res);
        return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ mensaje: "Ruta no encontrada." }));
});

servidor.listen(3000, () => {
    console.log("----------------------");
    console.log("Servidor iniciado en:");
    console.log("http://localhost:3000");
    console.log("----------------------");
});