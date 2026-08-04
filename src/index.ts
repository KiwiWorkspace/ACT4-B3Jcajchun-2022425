import { menuPrincipal } from "./menu/MenuPrincipal";
import { UsuarioService } from "./service/UsuarioService";
import { rl } from "./utils/Readline";
import "./server/Server";

const service = new UsuarioService();

async function login() {
    while (true) {
        console.log("| INICIO DE SESIÓN |");
        const correo = await rl.question("Correo: ");
        const contrasena = Number(await rl.question("Contraseña: "));
        const usuario = await service.login(correo, contrasena);

        if (usuario) {
            console.log("Bienvenido " + usuario.nombre + " " + usuario.apellido);
            return;
        }

        console.log("Correo o contraseña incorrectos. Intente de nuevo.");
    }
}

async function main() {
    await login();
    await menuPrincipal();
}

main();