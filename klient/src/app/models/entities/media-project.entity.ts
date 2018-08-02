import {Media} from "./media.entity";
import {Project} from "./project.entity";

export class MediaProject {
    public mediaProjectId: number;
    public mediaId: Media;
    public projectId: Project;
}
