import {Component, OnInit, TemplateRef,} from "@angular/core";
import {UserService} from "../../services/users/users.service";
import {User} from "../../models/entities/user.entity";
import {FormsModule} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {a} from "@angular/core/src/render3";

@Component({
  selector: "app-uporabniki",
  templateUrl: "./uporabniki.component.html",
  styleUrls: ["./uporabniki.component.css"],
    providers: [UserService]
})
export class UporabnikiComponent implements OnInit {

  public users: User[] = new Array;
  public shownUsers: User[] = new Array;

  public searchId: string = null;
  public searchUsername: string = null;
  public searchRoleId: number = null;
  public searchActive: boolean = null;

  public vlogaDropMenu: string = null;
  public activeDropMenu: string = null;

  editUserRef: BsModalRef;
  newUserRef: BsModalRef;

  public userToEdit: User;
  public editUserSuccess = false;
  public userFail = false;
  public deleteUserSuccess = false;
  public createUserSuccess = false;

  constructor(private uporabnikiService: UserService, private modalService: BsModalService) { }

  ngOnInit() {
    this.dobiUporabnike();
  }

  public dobiUporabnike() {
    this.uporabnikiService.getUsers().subscribe((data: {users}) => {
      this.users = data.users;
      this.searchUsers();
    }, (err) => {
      console.log(err);
    });
  }

  public searchUsers() {
    this.shownUsers = this.searchById(this.searchByName(this.searchByRole(this.searchByActive(this.users))));
  }

  public resetSearch() {
  this.searchId = null;
  this.searchUsername = null;
  this.searchRoleId = null;
  this.searchActive = null;
  this.searchUsers();
  }

  public searchById(arr: User[]): User[] {
    const ret: User[] = new Array;
    arr.forEach(element => {
      if (this.searchId) {
        if (element.userId === parseInt(this.searchId, 10)) {
          ret.push(element);
        }
      } else {
        ret.push(element);
      }
    });
    return ret;
  }
  public searchByName(arr: User[]): User[] {
        const ret: User[] = new Array;
        arr.forEach(element => {
            if (this.searchUsername) {
                if (element.username.indexOf(this.searchUsername) >= 0) {
                    ret.push(element);
                }
            } else {
                ret.push(element);
            }
        });
        return ret;
    }
  public searchByRole(arr: User[]): User[] {
        const ret: User[] = new Array;
        arr.forEach(element => {
            if (this.searchRoleId) {
                if (element.roleId.roleId === this.searchRoleId) {
                    ret.push(element);
                }
            } else {
                ret.push(element);
            }
        });
        return ret;
    }
  public searchByActive(arr: User[]): User[] {
        const ret: User[] = new Array;
        arr.forEach(element => {
            if (this.searchActive != null) {
                if (element.active === this.searchActive) {
                    ret.push(element);
                }
            } else {
                ret.push(element);
            }
        });
        return ret;
    }

  public editUsr(user: User, ref: TemplateRef<any>) {
      this.editUserSuccess = false;
      this.userFail = false;
      this.deleteUserSuccess = false;
      this.editUserRef = this.modalService.show(ref);
      this.userToEdit = user;
  }

  public saveUsrChanges(user: User) {
      this.uporabnikiService.saveUser(user).subscribe((res: Response) => {
          this.editUserSuccess = true;
          this.userFail = false;
      }, () => {
          this.editUserSuccess = false;
          this.userFail = true;
      });
  }

  public deleteUser(user: User) {
      this.uporabnikiService.deleteUser(user).subscribe(() => {
          this.deleteUserSuccess = true;
          this.userFail = false;
          this.dobiUporabnike();
      }, () => {
          this.deleteUserSuccess = false;
          this.userFail = true;
      });
  }

  public showCreate(ref: TemplateRef<any>) {
    this.userToEdit = new User;
    this.userToEdit.roleId = {roleId: 3, role: "viewer"};
    this.userToEdit.active = false;
    this.newUserRef = this.modalService.show(ref);
    this.createUserSuccess = false;
    this.userFail = false;
  }

  public createUser(user: User) {
      user.password = "$2b$10$AP4xtsOur0knwrq1ObleYekiJ52Z482DxXTmEXKRA7DFfSuGSFnu2";
      this.uporabnikiService.createUser(user).subscribe(() => {
          this.createUserSuccess = true;
          this.userFail = false;
          this.dobiUporabnike();
      }, () => {
          this.createUserSuccess = false;
          this.userFail = true;
      });
  }
}
