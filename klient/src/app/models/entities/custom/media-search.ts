export class MediaSearch {
    public mediaID: number;
    public mediaDateFrom: Date;
    public mediaDateTill: Date;
    public mediaName: string;
    public mediaContent: boolean;
    public picture: boolean;
    public lastReviewer: string;
    public lastDateFrom: Date;
    public lastDateTill: Date;
    public interesting: boolean;

    constructor(mediaID: number, mediaDateFrom: Date, mediaDateTill: Date, mediaName: string, mediaContent: boolean, picture: boolean,
                lastReviewer: string, lastDateFrom: Date, lastDateTill: Date, interesting: boolean) {
        this.mediaID = mediaID;
        this.mediaDateFrom = mediaDateFrom;
        this.mediaDateTill = mediaDateTill;
        this.mediaName = mediaName;
        this.mediaContent = mediaContent;
        this.picture = picture;
        this.lastReviewer = lastReviewer;
        this.lastDateFrom = lastDateFrom;
        this.lastDateTill = lastDateTill;
        this.interesting = interesting;
    }
}
