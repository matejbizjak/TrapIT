export class MediaData {
    public empty: boolean;
    public interesting: boolean;
    public comment: string;

    constructor(empty: boolean, interesting: boolean, comment: string) {
        this.empty = empty;
        this.interesting = interesting;
        this.comment = comment;
    }
}
