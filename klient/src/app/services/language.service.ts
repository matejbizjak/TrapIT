import {Injectable} from "@angular/core";

@Injectable()
export class LanguageService {

    constructor() {
    }

    dobiTrenutniJezik(): Promise<string> {
        const jezik = localStorage.getItem("trapit_language");

        return new Promise((resolve, reject) => {
            if (jezik !== null) {
                resolve(jezik);
            } else {
                reject();
            }
        });
    }

    nastaviNovJezik(jezik: string) {
        localStorage.setItem("trapit_language", jezik);
    }
}
