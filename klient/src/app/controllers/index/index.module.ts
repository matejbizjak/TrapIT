import {NgModule} from "@angular/core";
import {IndexComponent} from "./index.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {BootstrapModule} from "../../bootstrap.module";
import {IndexAdminComponent} from "./admin/index-admin.component";
import {IndexReviewerComponent} from "./reviewer/index-reviewer.component";
import {IndexViewerComponent} from "./viewer/index-viewer.component";
import {IndexLinkComponent} from "./link/index-link.component";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        BootstrapModule,
        FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [
        IndexComponent,
        IndexAdminComponent,
        IndexReviewerComponent,
        IndexViewerComponent,
        IndexLinkComponent
    ]
})
export class IndexModule {

}
