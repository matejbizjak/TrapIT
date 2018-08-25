import {Component, OnInit} from "@angular/core";
import {LMarkdownEditorModule} from "ngx-markdown-editor";
import {ApiService} from "../../../services/api/api.service";
import {setTime} from "ngx-bootstrap/chronos/utils/date-setters";

@Component({
    selector: "app-home-page-info-editor",
    templateUrl: "./home-page-info-editor.component.html",
    styleUrls: ["./home-page-info-editor.component.css"]
})
export class HomePageInfoEditorComponent implements OnInit {
    // editor settings
    protected mode: string = "editor";
    protected height: string = "600px";
    protected hideToolbar: boolean = false;
    protected content: string = "loading ...";
    protected settings: string = "{\n" + "  \"hideIcons\": ['Bold', 'Italic', 'Heading', 'Refrence', 'Link', 'Image', 'Ul', 'Ol', 'Code', 'TogglePreview', 'FullScreen']  // default is empty, the value is case-sensitive\n" + "}";
    protected serverReply: string = null;
    protected errReply: string = null;

    public loading: number = 1;

    constructor(private apiService: ApiService) {
    }

    ngOnInit() {
        this.getMarkdownFile();
    }

    protected saveMarkdownFile() {
        this.loadingToggle();
        this.apiService.updateMarkdownFile(this.content).subscribe((body: { message, err }) => {
            this.loadingToggle();
            this.errReply = body.err;
            this.serverReply = body.message;
        });
    }

    protected getMarkdownFile() {
        this.loadingToggle();
        this.apiService.getMarkdownFile().subscribe((body: { markdown, err, message }) => {
            this.loadingToggle();
            if (body.markdown !== "error") {
                this.content = body.markdown;
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
