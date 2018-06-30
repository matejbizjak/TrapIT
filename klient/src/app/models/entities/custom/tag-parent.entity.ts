export class TagParent {
    public tagId: number;
    public name: string;
    public childTags: TagParent[];
    public input: boolean;
    public checkbox: boolean;
    public selectedChild: TagParent;

    constructor(tagId: number, name: string, childTags: TagParent[], input: boolean, checkbox: boolean, selectedChild: TagParent) {
        this.tagId = tagId;
        this.name = name;
        this.childTags = childTags;
        this.input = input;
        this.checkbox = checkbox;
        this.selectedChild = selectedChild;
    }
}
