export class TagParent {
    public tagId: number;
    public name: string;
    public childTags: TagParent[];
    public input: boolean;
    public checkbox: boolean;
    public selectedChild: TagParent;
    public inputValue: number;
    public checkboxValue: boolean;
    public napolnjen: boolean;

    constructor(tagId: number, name: string, childTags: TagParent[], input: boolean, checkbox: boolean, selectedChild: TagParent,
                inputValue: number, checkboxValue: boolean, napolnjen: boolean) {
        this.tagId = tagId;
        this.name = name;
        this.childTags = childTags;
        this.input = input;
        this.checkbox = checkbox;
        this.selectedChild = selectedChild;
        this.inputValue = inputValue;
        this.checkboxValue = checkboxValue;
        this.napolnjen = napolnjen;
    }
}
