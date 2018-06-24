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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BootstrapModule,
    FormsModule
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
