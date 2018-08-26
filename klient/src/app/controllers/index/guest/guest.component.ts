import {Component, OnInit} from "@angular/core";
import {ApiService} from "../../../services/api/api.service";
import {MarkdownComponent} from "ngx-markdown";
import {MarkdownService} from "ngx-markdown";

@Component({
    selector: "app-guest",
    templateUrl: "./guest.component.html",
    styleUrls: ["./guest.component.css"]
})
export class GuestComponent implements OnInit {
    errReply: string = null;
    serverReply: string = null;
    content: string = "";
    loading: number = 1;

    constructor(private apiService: ApiService, private markdownService: MarkdownService) {
    }

    ngOnInit() {
        this.getMarkdownFile();
    }

    protected getMarkdownFile() {
        this.loadingToggle();
        this.apiService.getMarkdownFile().subscribe((body: { markdown, err, message }) => {
            this.loadingToggle();
            if (body.markdown !== "error") {
                this.content = this.markdownService.compile(body.markdown);
            }
            this.errReply = body.err;
            this.serverReply = body.message;
            console.log(this.content);
        });
    }

    loadingToggle() {
        if (this.loading) this.loading = 0;
        else this.loading = 1;
    }
}
