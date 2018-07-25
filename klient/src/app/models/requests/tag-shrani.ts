import {User} from "../entities/user.entity";
import {Media} from "../entities/media.entity";

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

class TagZInputValue {
    public tagId;
    public inputValue;

    constructor(tagId, inputValue) {
        this.tagId = tagId;
        this.inputValue = inputValue;
    }
}
