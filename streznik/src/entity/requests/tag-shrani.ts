import {User} from "../User";
import {TagZInputValue} from "./tag-z-input-value";
import {Media} from "../Media";
import {MediaData} from "./media-data";

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

