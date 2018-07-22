import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api/api.service";


@Component({
    selector: 'app-add-folder',
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.css']
})
export class AddFolderComponent implements OnInit {
    serverReply: string = "No reply";
    basePath: string = "loading...";
    inputFolder: string;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.getBasePath();
    }

    //gets the base path from the server
    getBasePath() {
        this.apiService.apiCall("/settings/basePath").subscribe((data: { basePath }) => {
                this.basePath = data.basePath;
            }
        );
    }

}
