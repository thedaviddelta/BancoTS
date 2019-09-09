export default class Cuenta {
    private readonly _IBAN: string;
    private _dinero: number;
    private _movs: string[];

    constructor(IBAN: string) {
        this._IBAN = IBAN;
        this._dinero = 0;
        this._movs = [];
    }

    get IBAN(): string {
        return this._IBAN;
    }
    get dinero(): number {
        return this._dinero;
    }
    get movs(): string[] {
        return this._movs;
    }

    add(n: number): void {
        this._dinero += n;
    }

    subtract(n: number): boolean {
        if (this._dinero < n)
            return false;
        this._dinero -= n;
        return true;
    }

    addMov(s: string): void {
        this._movs.push(s);
    }
}