import {User} from "../entities/user.entity";

export class TagShrani {
    public user: User;
    public potDoSlike: string;
    public oznaceniTagi: TagZInputValue[];
    public idVsehTagovVProjektu: number[];

    constructor(user: User, potDoSlike: string, oznaceniTagi: TagZInputValue[], idVsehTagovVProjektu: number[]) {
        this.user = user;
        this.potDoSlike = potDoSlike;
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
