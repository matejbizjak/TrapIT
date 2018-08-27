import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../../services/api/api.service";
import {MarkdownComponent} from "ngx-markdown";
import * as MRKD from "./marked.js";



@Component({
    selector: "app-guest",
    templateUrl: "./guest.component.html",
    styleUrls: ["./guest.component.css"]
})
export class GuestComponent implements OnInit {
    errReply: string = null;
    serverReply: string = null;
    content: string = null;
    loading: number = 1;


    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.getMarkdownFile();
    }

    protected getMarkdownFile() {
        this.loadingToggle();
        this.apiService.getMarkdownFile().subscribe((body: { markdown, err, message }) => {
            this.loadingToggle();
            if (body.markdown !== "error") {
                // Keep this not imported !!!
                this.content = MRKD(body.markdown);
            }
            this.errReply = body.err;
            this.serverReply = body.message;
        });
    }

    loadingToggle() {
        if (this.loading) this.loading = 0;
        else this.loading = 1;
    }


}
