import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from "@angular/core";
import {Tag} from "../../models/entities/tag.entity";
import {ZnackaService} from "../../services/znacka/znacka.service";
import {TagWChild} from "../dodajanje-znacke/dodajanje-znacke.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../services/language.service";

export interface TagWChild {
    tag: Tag;
    children: TagWChild[];
}

@Component({
    selector: "app-urejanje-znacke",
    templateUrl: "./urejanje-znacke.component.html",
    styleUrls: ["./urejanje-znacke.component.css"],
    providers: [ZnackaService]
})

export class UrejanjeZnackeComponent implements OnInit {

    @Input() ref;
    @Input() tag;

    @Output() change = new EventEmitter();
    @Output() close = new EventEmitter();

    public original: TagWChild[] = new Array;
    public copy: TagWChild[] = new Array;

    public saveSuccess = false;
    public saveError = false;
    public deleteSuccess = false;
    public deleteError = false;

    deleteRef: BsModalRef;

    constructor(private znackaService: ZnackaService, private modalService: BsModalService,
                private translate: TranslateService, private languageService: LanguageService) {
        this.translate.setDefaultLang("eng");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    ngOnInit() {
        this.znackaService.getChildren(this.tag).subscribe((tWc: TagWChild) => {
            this.original.push(tWc);
            this.copy.push(this.deepCopy(tWc));
        });
    }

    public resetTag() {
        this.copy[0] = this.deepCopy(this.original[0]);
    }

    public deepCopy(tag: TagWChild) {
        const tg: Tag = {tagId: null, name: null, input: false, checkbox: false, parentTagId: null, sloName: null, engName: null};
        Object.assign(tg, tag.tag);
        const arr: TagWChild[] = new Array;
        tag.children.forEach(child => {
            arr.push(this.deepCopy(child));
        });
        return {tag: tg, children: arr};
    }

    public saveChanges(DelTemplateRef: TemplateRef<any>) {
        if (this.copy.length > 0) {
            this.znackaService.saveChanges(this.copy[0]).subscribe(res => {
                if (res["message"] === "Success") {
                    this.saveSuccess = true;
                    this.saveError = false;
                    this.change.emit();
                }
            }, (err) => {
                this.saveError = true;
                this.saveSuccess = true;
            });
        } else {
            this.deleteRef = this.modalService.show(DelTemplateRef);
        }
    }

    public deleteTag() {
        this.znackaService.deleteTag(this.original).subscribe(res => {
            this.deleteSuccess = true;
            this.deleteError = false;
            this.change.emit();
        }, (err) => {
            this.deleteError = true;
            this.deleteSuccess = false;
        });
    }
}
