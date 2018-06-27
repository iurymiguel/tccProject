/**
 * @description Class which is responsible to manage local storage.
 */
export class LocalStorageProvider {
    
    constructor(

    ) {

    }

    /**
     * @description Saves a object in local storage.
     * @param {obj} the object to be saved.
     * @param {entityName} the key which identifies this object.
     */
    public static setObject(obj: any, entityName: string): void {
        window.localStorage.setItem(entityName, JSON.stringify(obj));
    }

    /**
     * @description Gets a obejct from local storage.
     * @param {entityName} the key which identifies this object.
     */
    public static getObject(entityName: string): any {
        return JSON.parse(window.localStorage.getItem(entityName));
    }

    /**
     * @description Saves a string value in local storage.
     * @param {value} the value to be saved.
     * @param {valueName} the key which identifies this value.
     */
    public static setValue(value: string, valueName: string): void {
        window.localStorage.setItem(valueName, value);
    }

    /**
     * @description Gets a value from local storage.
     * @param {valueName} the key which identifies this value.
     */
    public static getValue(valueName: string): string {
        return window.localStorage.getItem(valueName);
    }

    /**
     * @description Removes an item from local storage.
     * @param {entityName} the key which identifies this item.
     */
    public static removeItem(entityName: string): void {
        window.localStorage.removeItem(entityName);
    }
}