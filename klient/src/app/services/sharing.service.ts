import {Injectable} from "@angular/core";

@Injectable()
export class SharingService {
    private slovar: Map<string, any> = new Map<string, any>();

    constructor() {
    }

    public saveItem(tag: string, objekt: any): void {
        this.slovar.set(tag, objekt);
    }

    public getItem(tag: string): any {
        return this.slovar.get(tag);
    }

    public removeItem(tag: string): void {
        this.slovar.delete(tag);
    }

}
