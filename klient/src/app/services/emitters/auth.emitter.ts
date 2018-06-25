import {EventEmitter, Injectable, Output} from "@angular/core";

@Injectable()
export class AuthEmitter {

    @Output()
    fireJePrijavljen: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
    }

    public sporociSprememboAvtentikacije(jePrijavljen: boolean): void {
        this.fireJePrijavljen.emit(jePrijavljen);
    }

    public pridobiSprememboAvtentikacije(): EventEmitter<any> {
        return this.fireJePrijavljen;
    }
}
