import fs from "fs";
import { homedir } from "os";
import Cuenta from "./Cuenta";
import Cliente from "./Cliente";

const path = `${homedir}/banco_app.json`;

export const save = (clientes: Cliente[]): void => {
    fs.writeFileSync(path, JSON.stringify(clientes, null, 4));
}

export const get = (clientes: Cliente[]): void => {
    if (!fs.existsSync(path))
        return;
    
    fs.readFile(path, (err, data) => {
        if (err) 
            return alert("Error al leer los datos");

        const arr: Cliente[] = JSON.parse(data.toString());
        arr.forEach(cl => {
            cl = Object.assign(new Cliente("", ""), cl);
            for (let i = 0; i < cl.cuentas.length; i++) 
                cl.cuentas[i] = Object.assign(new Cuenta(""), cl.cuentas[i]);
            clientes.push(cl);
        });
    });
}