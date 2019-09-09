import Cuenta from "./Cuenta";

export default class Cliente {
    private _nombre: string;
    private _pass: string;
    private _cuentas: Cuenta[];

    constructor(nombre: string, pass: string) {
        this._nombre = nombre;
        this._pass = pass;
        this._cuentas = [];
    }

    get nombre(): string {
        return this._nombre;
    }
    get pass(): string {
        return this._pass;
    }
    get cuentas(): Cuenta[] {
        return this._cuentas;
    }

    addCuenta(IBAN: string): boolean {
        for (const c of this._cuentas)
            if (c.IBAN === IBAN)
                return false;
        
        this._cuentas.push(new Cuenta(IBAN));
        return true;
    }

    remCuenta(IBAN: string): void {
        this._cuentas = this._cuentas.filter(c => c.IBAN !== IBAN);
    }
}