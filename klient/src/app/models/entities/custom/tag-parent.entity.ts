export class TagParent {
    public tagId: number;
    public name: string;
    public childTags: TagParent[];
    public input: boolean;

    constructor(tagId: number, name: string, childTags: TagParent[], input: boolean) {
        this.tagId = tagId;
        this.name = name;
        this.childTags = childTags;
        this.input = input;
    }
}
