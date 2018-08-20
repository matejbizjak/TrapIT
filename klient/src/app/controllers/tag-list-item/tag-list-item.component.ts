import {Component, Input, OnInit} from "@angular/core";
import {TagWChild} from "../dodajanje-znacke/dodajanje-znacke.component";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../services/language.service";
import {Tag} from "../../models/entities/tag.entity";

@Component({
    selector: "tag-list-item",
    templateUrl: "./tag-list-item.component.html",
    styleUrls: ["./tag-list-item.component.css"]
})
export class TagListItemComponent implements OnInit {

    @Input() children;

    constructor(private translate: TranslateService, private languageService: LanguageService) {
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    ngOnInit() {
    }

    public addToTag(tag: TagWChild) {

        const newTag: TagWChild = {
            tag: {tagId: null, name: "", checkbox: false, input: false, parentTagId: tag.tag, sloName: "", engName: ""},
            children: null,
        };

        if (tag.children) {
            tag.children.push(newTag);
        } else {
            tag.children = new Array;
            tag.children.push(newTag);
        }
    }

    public removeTag(tag: TagWChild) {
        const index = this.children.indexOf(tag);

        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    public nameChange(tag: Tag) {
        const dbName = tag.sloName
            .toLowerCase()
            .replace(" ", "_")
            .replace("č", "c")
            .replace("š", "s")
            .replace("ž", "z");
        tag.name = dbName;
    }
}

