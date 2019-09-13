import { remote } from "electron";
import bcrypt from "bcryptjs";
import Cuenta from "./Cuenta";
import Cliente from "./Cliente";
import { get, save } from "./Almacenar";
export = {};

let currentUser: Cliente;
let currentAcc: Cuenta;

const clientes: Cliente[] = [];
const div: Element = document.getElementsByClassName("container-fluid")[0];
const win: Electron.BrowserWindow = remote.getCurrentWindow();

window.addEventListener("beforeunload", (e) => {
    try {
        save(clientes);
    } catch (error) {
        remote.dialog.showMessageBox(win, { message: "Error al guardar los datos" });
        e.returnValue = false;
    }
});
get(clientes);

const mainMenu = (): void => {
    div.innerHTML = `
    <div>
        <div class="row">
            <div class="col">
                <h1 class="display-4">Bienvenido</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-primary border-light" onclick="login()">Login</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-success border-light" onclick="signup()">Sign up</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-danger border-light" onclick="win.close()">Salir</button>
            </div>
        </div>
    </div>
    `;

    document.title = "Menú principal";
}

const signup = (): void => {
    div.innerHTML = `
    <div>
        <div class="row mt-2 mb-5">
            <div class="col">
                <h1 class="display-4">Introduce los datos del usuario</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <p class="h4">Nombre</p>
            </div>
            <div class="col">
                <input type="text" id="nom" class="form-control">
            </div>
        </div>
        <div class="row">
            <div class="col">
                <p class="h4">Contraseña</p>
            </div>
            <div class="col">
                <input type="password" id="pass" class="form-control">
            </div>
        </div>
        <div class="row mt-5 mb-2">
            <div class="col text-right">
                <button class="btn btn-lg btn-warning" onclick="mainMenu()">Volver</button>
            </div>
            <div class="col text-left">
                <button class="btn btn-lg btn-success">Crear</button>
            </div>
        </div>
    </div>
    `;

    document.title = "Creando usuario";

    const create: Element = document.getElementsByClassName("btn-success")[0];

    create.addEventListener("click", () => {
        create.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true" style="width: 1.5rem; height: 1.5rem;" />`;
        create.setAttribute("disabled", "true");
        document.getElementsByClassName("btn-warning")[0].setAttribute("disabled", "true");
        create.className = "btn btn-lg btn-primary";

        setTimeout(() => {
            const nom: string = (<HTMLInputElement>document.getElementById("nom")).value;
            const pass: string = (<HTMLInputElement>document.getElementById("pass")).value;

            const exists: boolean = clientes.some(cl => cl.nombre === nom);

            if (exists) {
                create.className = "btn btn-lg btn-danger";
                create.innerHTML = "Error";
            } else {
                clientes.push(new Cliente(nom, bcrypt.hashSync(pass, 11)));

                create.className = "btn btn-lg btn-info";
                create.innerHTML = "Creado";
            }

            setTimeout(() => {
                create.innerHTML = "Crear";
                create.className = "btn btn-lg btn-success";
                create.removeAttribute("disabled");
                document.getElementsByClassName("btn-warning")[0].removeAttribute("disabled");
            }, 1500);
        }, 3000);
    });
}

const login = (): void => {
    div.innerHTML = `
    <div>
        <div class="row mt-2 mb-5">
            <div class="col">
                <h1 class="display-4">Introduce las credenciales</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <p class="h4">Nombre</p>
            </div>
            <div class="col">
                <input type="text" id="nom" class="form-control">
            </div>
        </div>
        <div class="row">
            <div class="col">
                <p class="h4">Contraseña</p>
            </div>
            <div class="col">
                <input type="password" id="pass" class="form-control">
            </div>
        </div>
        <div class="row mt-5 mb-2">
            <div class="col text-right">
                <button class="btn btn-lg btn-warning" onclick="mainMenu()">Volver</button>
            </div>
            <div class="col text-left">
                <button class="btn btn-lg btn-success">Entrar</button>
            </div>
        </div>
    </div>
    `;

    document.title = "Logeando";

    const enter: Element = document.getElementsByClassName("btn-success")[0];

    enter.addEventListener("click", () => {
        enter.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true" style="width: 1.5rem; height: 1.5rem;" />`;
        enter.setAttribute("disabled", "true");
        document.getElementsByClassName("btn-warning")[0].setAttribute("disabled", "true");
        enter.className = "btn btn-lg btn-primary";

        setTimeout(() => {
            const nom: string = (<HTMLInputElement>document.getElementById("nom")).value;
            const pass: string = (<HTMLInputElement>document.getElementById("pass")).value;

            const found: Cliente | undefined = clientes.find(cl => cl.nombre === nom && bcrypt.compareSync(pass, cl.pass));

            if (!found) {
                enter.className = "btn btn-lg btn-danger";
                enter.innerHTML = "Error";

                setTimeout(() => {
                    enter.innerHTML = "Entrar";
                    enter.className = "btn btn-lg btn-success";
                    enter.removeAttribute("disabled");
                    document.getElementsByClassName("btn-warning")[0].removeAttribute("disabled");
                }, 1500);
            } else {
                currentUser = found;

                enter.className = "btn btn-lg btn-info";
                enter.innerHTML = "Logeado";
                setTimeout(userMenu, 1500);
            }
        }, 3000);
    });
}

const userMenu = (): void => {
    div.innerHTML = `
    <div>
        <div class="row">
            <div class="col">
                <h1 class="display-4">Bienvenido, ${currentUser.nombre}</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-primary border-light" onclick="createAcc()">Crear cuenta</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-success border-light" onclick="selectAcc()">Seleccionar cuenta existente</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-danger border-light" onclick="mainMenu()">Deslogear</button>
            </div>
        </div>
    </div>
    `;

    document.title = `Logeado como ${currentUser.nombre}`;
}

const createAcc = (): void => {
    div.innerHTML = `
    <div>
        <div class="row">
            <div class="col">
                <h1 class="display-4">Creando cuenta...</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-primary" onclick="userMenu()" disabled>
                    <span class="spinner-border" role="status" aria-hidden="true" style="width: 1.5rem; height: 1.5rem;" />
                </button>
            </div>
        </div>
    </div>
    `;

    document.title = `Creando cuenta...`;

    let cont: number = 0;
    const interval: NodeJS.Timeout = setInterval(() => {
        const btn: Element = document.getElementsByClassName("btn-primary")[0];
        const bar: Element = document.getElementsByClassName("progress-bar")[0];

        cont += 2;
        bar.setAttribute("aria-valuenow", `${cont}`);
        bar.setAttribute("style", `width: ${cont}%`);

        if (cont >= 100) {
            clearInterval(interval);

            while (true) {
                const nums: number[] = []; 
                for (let i = 0; i < 16; i++) 
                    nums.push(Math.floor(Math.random() * 10));
                if (currentUser.addCuenta("ES29" + nums.join("")))
                    break;
            }

            bar.className = "progress-bar progress-bar-striped progress-bar-animated bg-success";
            btn.className = "btn btn-lg btn-warning";
            btn.removeAttribute("disabled");
            btn.innerHTML = "Volver";

            document.title = `Cuenta creada: ${currentUser.cuentas[currentUser.cuentas.length - 1].IBAN}`;
            document.getElementsByTagName("h1")[0].innerText = currentUser.cuentas[currentUser.cuentas.length - 1].IBAN;
        }
    }, 75);
}

const selectAcc = (): void => {
    document.title = "Selecciona la cuenta";

    if (currentUser.cuentas.length <= 0) {
        div.innerHTML = `
        <div>
            <div class="row">
                <div class="col">
                    <h1 class="display-3">Este usuario no tiene cuentas</h1>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <button class="btn btn-lg btn-warning" onclick="userMenu()">Volver</button>
                </div>
            </div>
        </div>
        `;
        
        return;
    }

    div.innerHTML = `
    <div>
        <div class="row">
            <div class="col">
                <h1 class="display-4">Selecciona la cuenta</h1>
            </div>
        </div>
        <div class="row">
            <div class="col" id="accs"></div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-warning" onclick="userMenu()">Volver</button>
            </div>
        </div>
    </div>
    `;

    const accs: HTMLElement = (<HTMLInputElement>document.getElementById("accs"));
    currentUser.cuentas.forEach(cu => {
        accs.innerHTML += `
        <div class="row">
            <div class="col text-right pr-0">
                <button class="btn btn-lg btn-primary">${cu.IBAN}</button>
            </div>
            <div class="col-4 text-left">
                <button class="btn btn-lg btn-info" onclick="navigator.clipboard.writeText('${cu.IBAN}')"><i class="fas fa-clipboard"></i></button>
            </div>
        </div>
        `;
    });
    const btns: HTMLCollectionOf<Element> = document.getElementsByClassName("btn-primary");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", () => {
            currentAcc = currentUser.cuentas[i];
            accMenu();
        });
    }
}

const accMenu = (): void => {
    div.innerHTML = `
    <div>
        <div class="row">
            <div class="col">
                <h1 class="display-4">Selecciona operación</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-primary border-light" onclick="ingresar()">Ingresar</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-secondary border-light" onclick="reintegrar()">Reintegrar</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-success border-light" onclick="transferir()">Transferir</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-danger border-light" onclick="cancelar()">Cancelar cuenta</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-info border-light" onclick="movimientos()">Listar movimientos</button>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-warning border-dark" onclick="userMenu()">Cambiar cuenta</button>
            </div>
        </div>
    </div>
    `;

    document.title = `Cuenta actual: ${currentAcc.IBAN}`;
}

const ingresar = (): void => {
    div.innerHTML = `
    <div>
        <div class="row mt-2 mb-5">
            <div class="col">
                <h1 class="display-4">Introduce la cantidad a ingresar:</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="number" id="money" class="form-control" min="0" step="10" value="0">
            </div>
        </div>
        <div class="row mt-5 mb-2">
            <div class="col text-right">
                <button class="btn btn-lg btn-warning" onclick="accMenu()">Volver</button>
            </div>
            <div class="col text-left">
                <button class="btn btn-lg btn-success">Ingresar</button>
            </div>
        </div>
    </div>
    `;

    const success: Element = document.getElementsByClassName("btn-success")[0];

    success.addEventListener("click", () => {
        success.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true" style="width: 1.5rem; height: 1.5rem;" />`;
        success.setAttribute("disabled", "true");
        document.getElementsByClassName("btn-warning")[0].setAttribute("disabled", "true");
        success.className = "btn btn-lg btn-primary";

        setTimeout(() => {
            const money: number = +(<HTMLInputElement>document.getElementById("money")).value;

            if (!isNaN(money) && money > 0) {
                currentAcc.add(money);
                currentAcc.addMov(`Ingreso: +${money.toFixed(2)}$`);

                success.className = "btn btn-lg btn-info";
                success.innerHTML = "Ingresado";
            } else {
                success.className = "btn btn-lg btn-danger";
                success.innerHTML = "Error";
            }

            setTimeout(() => {
                success.innerHTML = "Ingresar";
                success.className = "btn btn-lg btn-success";
                success.removeAttribute("disabled");
                document.getElementsByClassName("btn-warning")[0].removeAttribute("disabled");
            }, 1500);
        }, 3000);
    });
}

const reintegrar = (): void => {
    div.innerHTML = `
    <div>
        <div class="row mt-2 mb-5">
            <div class="col">
                <h1 class="display-4">Introduce la cantidad a reintegrar:</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="number" id="money" class="form-control" min="0" step="10" value="0">
            </div>
        </div>
        <div class="row mt-5 mb-2">
            <div class="col text-right">
                <button class="btn btn-lg btn-warning" onclick="accMenu()">Volver</button>
            </div>
            <div class="col text-left">
                <button class="btn btn-lg btn-success">Reintegrar</button>
            </div>
        </div>
    </div>
    `;

    const success: Element = document.getElementsByClassName("btn-success")[0];

    success.addEventListener("click", () => {
        success.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true" style="width: 1.5rem; height: 1.5rem;" />`;
        success.setAttribute("disabled", "true");
        document.getElementsByClassName("btn-warning")[0].setAttribute("disabled", "true");
        success.className = "btn btn-lg btn-primary";

        setTimeout(() => {
            const money: number = +(<HTMLInputElement>document.getElementById("money")).value;

            if (!isNaN(money) && money > 0 && currentAcc.subtract(money)) {
                currentAcc.addMov(`Reintegro: -${money.toFixed(2)}$`);

                success.className = "btn btn-lg btn-info";
                success.innerHTML = "Reintegrado";
            } else {
                success.className = "btn btn-lg btn-danger";
                success.innerHTML = "Error";
            }

            setTimeout(() => {
                success.innerHTML = "Reintegrar";
                success.className = "btn btn-lg btn-success";
                success.removeAttribute("disabled");
                document.getElementsByClassName("btn-warning")[0].removeAttribute("disabled");
            }, 1500);
        }, 3000);
    });
}

const transferir = (): void => {
    div.innerHTML = `
    <div>
        <div class="row mt-1 mb-1">
            <div class="col">
                <h1 class="display-4" style="font-size: 3rem">Introduce el IBAN de la cuenta a ingresar:</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="text" class="form-control" id="iban" pattern="ES29[1-9]{16}">
            </div>
        </div>
        <div class="row mt-4 mb-1">
            <div class="col">
                <h1 class="display-4" style="font-size: 3rem">Introduce la cantidad a transferir:</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <input type="number" id="money" class="form-control" min="0" step="10" value="0">
            </div>
        </div>
        <div class="row mt-5 mb-1">
            <div class="col text-right">
                <button class="btn btn-lg btn-warning" onclick="accMenu()">Volver</button>
            </div>
            <div class="col text-left">
                <button class="btn btn-lg btn-success">Transferir</button>
            </div>
        </div>
    </div>
    `;

    const success: Element = document.getElementsByClassName("btn-success")[0];

    success.addEventListener("click", () => {
        success.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true" style="width: 1.5rem; height: 1.5rem;" />`;
        success.setAttribute("disabled", "true");
        document.getElementsByClassName("btn-warning")[0].setAttribute("disabled", "true");
        success.className = "btn btn-lg btn-primary";

        setTimeout(() => {
            const iban: string = (<HTMLInputElement>document.getElementById("iban")).value;
            const money: number = +(<HTMLInputElement>document.getElementById("money")).value;
            
            if (iban !== currentAcc.IBAN
            && clientes.some(cl => cl.cuentas.some(cu => iban === cu.IBAN))
            && !isNaN(money) && money > 0
            && currentAcc.subtract(money)) {const cu: Cuenta = (<Cuenta>(<Cliente>clientes.find(cl => cl.cuentas.some(cu => cu.IBAN === iban))).cuentas.find(cu => cu.IBAN === iban));
                cu.add(money);
                cu.addMov(`Transferencia: +${money.toFixed(2)}$ (de ${currentAcc.IBAN})`);
                currentAcc.addMov(`Transferencia: -${money.toFixed(2)}$ (a ${cu.IBAN})`);

                success.className = "btn btn-lg btn-info";
                success.innerHTML = "Transferido";
            } else {
                success.className = "btn btn-lg btn-danger";
                success.innerHTML = "Error";
            }

            setTimeout(() => {
                success.innerHTML = "Transferir";
                success.className = "btn btn-lg btn-success";
                success.removeAttribute("disabled");
                document.getElementsByClassName("btn-warning")[0].removeAttribute("disabled");
            }, 1500);
        }, 3000);
    });
}

const cancelar = (): void => {
    div.innerHTML = `
    <div>
        <div class="row mt-2 mb-5">
            <div class="col">
                <h1 class="display-4" style="font-size: 4rem">¿Estás seguro?</h1>
            </div>
        </div>
        <div class="row mt-5 mb-2">
            <div class="col text-right">
                <button class="btn btn-block btn-warning border-dark" style="font-size: 3rem" onclick="accMenu()">No</button>
            </div>
            <div class="col text-left">
                <button class="btn btn-block btn-danger border-light" style="font-size: 3rem">Sí</button>
            </div>
        </div>
    </div>
    `;

    const yes: Element = document.getElementsByClassName("btn-danger")[0];
    const btns: Element = document.getElementsByClassName("row")[1];

    yes.addEventListener("click", () => {
        yes.innerHTML = `<span class="spinner-border" role="status" aria-hidden="true" style="width: 3.5rem; height: 3.5rem;" />`;
        yes.setAttribute("disabled", "true");
        document.getElementsByClassName("btn-warning")[0].setAttribute("disabled", "true");
        yes.className = "btn btn-block btn-primary border-light";

        setTimeout(() => {
            btns.innerHTML = `
            <div class="col">
                <button class="btn btn-block btn-success border-light" style="font-size: 3rem" disabled>Cancelada</button>
            </div>
            `;

            currentUser.cuentas.splice(currentUser.cuentas.indexOf(currentAcc), 1);
            setTimeout(userMenu, 1500);
        }, 3000);
    });
}

const movimientos = (): void => {
    if (currentAcc.movs.length <= 0) {
        div.innerHTML = `
        <div>
            <div class="row">
                <div class="col">
                    <h1 class="display-3">Esta cuenta no tiene movimientos</h1>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <button class="btn btn-lg btn-warning" onclick="accMenu()">Volver</button>
                </div>
            </div>
        </div>
        `;
        
        return;
    }

    div.innerHTML = `
    <div>
        <div class="row">
            <div class="col">
                <h1 class="display-4">Movimientos de la cuenta</h1>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <ul class="list-group w-75 mx-auto mt-2 mb-4" id="movs"></ul>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <button class="btn btn-lg btn-warning" onclick="accMenu()">Volver</button>
            </div>
        </div>
    </div>
    `;

    const movs: HTMLElement = (<HTMLInputElement>document.getElementById("movs"));
    currentAcc.movs.forEach(mov => {
        if (mov.includes("Ingreso"))
            movs.innerHTML = `<li class="list-group-item list-group-item-success">${mov}</li>` + movs.innerHTML;
        else if (mov.includes("Reintegro"))
            movs.innerHTML = `<li class="list-group-item list-group-item-danger">${mov}</li>` + movs.innerHTML;
        else if (mov.includes("(de"))
            movs.innerHTML = `<li class="list-group-item list-group-item-primary">${mov.replace("(", "<br>(")}</li>` + movs.innerHTML;
        else if (mov.includes("(a"))
            movs.innerHTML = `<li class="list-group-item list-group-item-warning">${mov.replace("(", "<br>(")}</li>` + movs.innerHTML;
    });
}

mainMenu();