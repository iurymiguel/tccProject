/**
 * @description Class which is responsible to manage local storage.
 */
export class LocalStorageProvider {
    
    constructor() {
    }

    /**
     * @description Salva um objeto no local storage.
     * @param obj O objeto a ser salvo.
     * @param entityName A chave identificadora do objeto.
     */
    public static setObject(obj: any, entityName: string): void {
        window.localStorage.setItem(entityName, JSON.stringify(obj));
    }

    /**
     * @description Recupera um objeto do local storage.
     * @param entityName A chave identificadora do objeto.
     */
    public static getObject(entityName: string): any {
        return JSON.parse(window.localStorage.getItem(entityName));
    }

    /**
     * @description Salva uma string no local storage.
     * @param value A string a ser salva.
     * @param valueName A chave identificadora da string.
     */
    public static setValue(value: string, valueName: string): void {
        window.localStorage.setItem(valueName, value);
    }

    /**
     * @description Recupera uma string do local storage.
     * @param valueName A chave identificadora da string.
     */
    public static getValue(valueName: string): string {
        return window.localStorage.getItem(valueName);
    }

    /**
     * @description Remove um objeto do local storage.
     * @param entityName A chave identificadora do objeto.
     */
    public static removeItem(entityName: string): void {
        window.localStorage.removeItem(entityName);
    }
}