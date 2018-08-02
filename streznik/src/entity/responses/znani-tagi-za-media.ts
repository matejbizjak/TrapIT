import {MediaData} from "../custom/media-data";
import {MediaTag} from "../MediaTag";

export class ZnaniTagiZaMedia {
    public tagTagi: MediaTag[];
    public mediaTagi: MediaData;

    constructor(tagTagi: MediaTag[], mediaTagi: MediaData) {
        this.tagTagi = tagTagi;
        this.mediaTagi = mediaTagi;
    }
}
