export class MediaSearch {
    public mediaID: number;
    public mediaDate: Date;
    public mediaName: string;
    public mediaContent: boolean;
    public picture: boolean;
    public lastReviewer: string;
    public lastDate: Date;
    public interesting: boolean;

    constructor(mediaID: number, mediaDate: Date, mediaName: string, mediaContent: boolean, picture: boolean,
                lastReviewer: string, lastDate: Date, interesting: boolean) {
        this.mediaID = mediaID;
        this.mediaDate = mediaDate;
        this.mediaName = mediaName;
        this.mediaContent = mediaContent;
        this.picture = picture;
        this.lastReviewer = lastReviewer;
        this.lastDate = lastDate;
        this.interesting = interesting;
    }
}
