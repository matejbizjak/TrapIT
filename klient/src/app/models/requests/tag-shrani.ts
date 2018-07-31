import {User} from "../entities/user.entity";
import {Media} from "../entities/media.entity";
import {MediaData} from "../entities/custom/media-data";

export class TagShrani {
    public user: User;
    public media: Media;
    public oznaceniTagi: TagZInputValue[];
    public idVsehTagovVProjektu: number[];
    public mediaData: MediaData;

    constructor(user: User, media: Media, oznaceniTagi: TagZInputValue[], idVsehTagovVProjektu: number[], mediaData: MediaData) {
        this.user = user;
        this.media = media;
        this.oznaceniTagi = oznaceniTagi;
        this.idVsehTagovVProjektu = idVsehTagovVProjektu;
        this.mediaData = mediaData;
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
