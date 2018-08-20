import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Tag} from "../../models/entities/tag.entity";
import {ZnackaService} from "../../services/znacka/znacka.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../services/language.service";

export interface TagWChild {
    tag: Tag;
    children: TagWChild[];
}

@Component({
    selector: "app-dodajanje-znacke",
    templateUrl: "./dodajanje-znacke.component.html",
    styleUrls: ["./dodajanje-znacke.component.css"],
    providers: [ZnackaService]
})

export class DodajanjeZnackeComponent implements OnInit {

    @Input() ref;

    @Output() change = new EventEmitter();

    public newTag: TagWChild[] = new Array;
    public newTagSuccess: boolean;
    public newTagError: boolean;
    public nameError: boolean;

    constructor(private znackaService: ZnackaService, private translate: TranslateService, private languageService: LanguageService) {
        this.newTagSuccess = false;
        this.newTagError = false;
        this.nameError = false;
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    ngOnInit() {
    }

    public addRootTag() {
        const newRoot: TagWChild = {
            tag: {tagId: null, name: "", input: false, checkbox: false, parentTagId: null, sloName: "", engName: ""},
            children: null,
        };
        this.newTag.push(newRoot);
    }

    public saveNewTag() {
        this.znackaService.saveNewTag(this.newTag).subscribe((data: { message }) => {
            this.newTagSuccess = true;
            this.newTagError = false;
            this.nameError = false;
            this.change.emit();
        }, (data) => {
            if (data.error.message === "Name_Exists") {
                this.nameError = true;
                this.newTagSuccess = false;
            } else {
                this.newTagError = true;
                this.newTagSuccess = false;
            }
        });
    }
}
