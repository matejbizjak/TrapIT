import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../../services/api/api.service";

@Component({
    selector: "app-path-settings",
    templateUrl: "./path-settings.component.html",
    styleUrls: ["./path-settings.component.css"]
})
export class PathSettingsComponent implements OnInit {
    selected: number = 0;
    selectedPath: string = "";
    loading: number = 1;
    serverReply: string = "";
    paths: string[];

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.getAllPaths();
    }

    selectPath(selectedPath: string) {
        this.selected = 1;
        this.selectedPath = selectedPath;
    }

    getAllPaths() {
        this.loadingToggle();
        this.apiService.apiCall("/settings/paths").subscribe((data: {paths: string[], serverReply: string} ) => {
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
