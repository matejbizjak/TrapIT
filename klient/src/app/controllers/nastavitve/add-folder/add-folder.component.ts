import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../../services/api/api.service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";
import {ProjektService} from "../../../services/projekt/projekt.service";
import {OznacevanjeService} from "../../../services/oznacevanje/oznacevanje.service";


@Component({
    selector: "app-add-folder",
    templateUrl: "./add-folder.component.html",
    styleUrls: ["./add-folder.component.css"]
})
export class AddFolderComponent implements OnInit {
    loading: number = 1;
    serverReply: string = "V zgornje polje vpišite samo ime iskane mape...";
    basePath: string = "loading...";
    public potDoSlik: string;

    // used for new folder insertion
    inputFolder: string;
    folders: string[];
    files: string[];
    // visualization
    added: number[];
    exist: number[];

    public emptyProjektNameWarning = false;
    public duplicateProjectWarning = false;
    public otherErrorWarning = false;
    public projectCreateSuccess = false;
    public projectDeleteSuccess = false;
    public potSuccess1 = false;
    public potSuccess2 = false;
    public potEmpty = false;

    constructor(private apiService: ApiService, public translate: TranslateService, private languageService: LanguageService, private projectService: ProjektService, private oznacevanjeService: OznacevanjeService) {
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    ngOnInit() {
        this.getBasePath();
    }

    // gets the base path from the server
    getBasePath() {
        this.loadingToggle();
        this.apiService.apiCall("/settings/basePath").subscribe((data: { basePath }) => {
                this.loadingToggle();
                this.basePath = data.basePath;
                this.potDoSlik = data.basePath;
            }
        );
    }

    reset() {
        this.inputFolder = null;
        this.folders = null;
        this.files = null;
    }

    // gets all avalible folders that have the same name
    getAvaliableFolders(name: string) {
        this.reset();
        this.loadingToggle();
        this.apiService.apiCall("/settings/folder/" + name).subscribe((data: { folders, serverReply }) => {
            this.loadingToggle();
            this.serverReply = data.serverReply;
            this.folders = data.folders;
        });
    }

    // retrieves the selection of folders
    addFolderToDataBase(path: string) {
        let data: string[] = [];

        if (path.includes("\\")) {
            data = path.split("\\");
        } else {
            data = path.split("/");
        }

        const warning = "Slike, ki so v mapi \"" + path + "\" bodo uvožene v bazo pod krmiščom \"" + data[data.length - 2] + "\". " +
            "Če ste preverili pravilnost podatkov, potem pristisnite OK.";

        if (confirm(warning)) {
            this.loadingToggle();
            this.inputFolder = path;
            this.apiService.apiCall("/settings/folder/add/" + encodeURIComponent(path) + "").subscribe((data: { serverReply, files, added, exist }) => {
                this.loadingToggle();
                this.folders = null;
                this.serverReply = data.serverReply;
                this.files = data.files;
                this.added = data.added;
                this.exist = data.exist;
            });
        }
    }

    checkIfAdded(i: number){
        if(this.exist.includes(i)) return 0;
        else if(this.added.includes(i)) return 1;
        else return -1;
    }

    loadingToggle() {
        if (this.loading) this.loading = 0;
        else this.loading = 1;
    }

    public setDir() {
        this.clearAlerts();
        if (this.potDoSlik) {
            this.projectService.nastaviPot(this.potDoSlik).subscribe((res) => {
                if (res["message"] === "Success") {
                    this.potSuccess1 = true;
                }
            });
            this.oznacevanjeService.nastaviPot(this.potDoSlik).subscribe((res) => {
                if (res["message"] === "Success") {
                    this.potSuccess2 = true;
                }
            });
        } else {
            this.potEmpty = true;
        }
    }

    public clearAlerts() {
        this.emptyProjektNameWarning = false;
        this.duplicateProjectWarning = false;
        this.otherErrorWarning = false;
        this.projectCreateSuccess = false;
        this.projectDeleteSuccess = false;
        this.potSuccess1 = false;
        this.potSuccess2 = false;
        this.potEmpty = false;
    }
}
