import {User} from "../User";
import {TagZInputValue} from "./tag-z-input-value";
import {Media} from "../Media";

export class TagShrani {
    public user: User;
    public media: Media;
    public oznaceniTagi: TagZInputValue[];
    public idVsehTagovVProjektu: number[];

    constructor(user: User, media: Media, oznaceniTagi: TagZInputValue[], idVsehTagovVProjektu: number[]) {
        this.user = user;
        this.media = media;
        this.oznaceniTagi = oznaceniTagi;
        this.idVsehTagovVProjektu = idVsehTagovVProjektu;
    }
}

