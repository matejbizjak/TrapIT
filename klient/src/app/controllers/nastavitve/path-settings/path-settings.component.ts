import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../../services/api/api.service";
import {Path} from "../../../models/entities/path.entity";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";

@Component({
    selector: "app-path-settings",
    templateUrl: "./path-settings.component.html",
    styleUrls: ["./path-settings.component.css"]
})
export class PathSettingsComponent implements OnInit {
    selected: number = 0;
    selectedPath: Path = null;

    loading: number = 1;
    serverReply: string = "";
    paths: Path[];

    constructor(private apiService: ApiService, public translate: TranslateService, private languageService: LanguageService) {
        this.translate.setDefaultLang("slo");
        this.languageService.dobiTrenutniJezik().then(lang => {
            this.translate.use(lang);
        });
    }

    ngOnInit() {
        this.getAllPaths();
    }

    selectPath(selectedPath: Path) {
        this.selected = 1;
        this.selectedPath = selectedPath;
    }

    updatePath(updatedPath: Path) {
        this.loadingToggle();
        this.apiService.apiCall("/settings/update/path/" + updatedPath.pathId + "/" + encodeURIComponent(updatedPath.value)).subscribe( (data: {serverReply: string}) => {
            this.loadingToggle();
            this.selected = 0;
            this.selectedPath = null;
            this.serverReply = data.serverReply;
            this.getAllPaths();
        });
    }

    getAllPaths() {
        this.loadingToggle();
        this.apiService.apiCall("/settings/paths").subscribe((data: {paths: Path[], serverReply: string} ) => {
            this.paths = data.paths;
            this.serverReply = data.serverReply;
            this.loadingToggle();
        });
    }

    loadingToggle() {
        if (this.loading) this.loading = 0;
        else this.loading = 1;
    }
}
