import {Site} from "./site.entity";
import {Path} from "./path.entity";
import {User} from "./user.entity";

export class Media {
    public mediaId: number;
    public date: Date;
    public name: string;
    public empty: boolean;
    public image: boolean;
    public interesting: boolean;
    public comment: string;
    public siteId: Site;
    public pathId: Path;
    public lastUserId: User;
    public lastDate: Date;
}
