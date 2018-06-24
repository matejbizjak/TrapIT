import * as bcrypt from "bcrypt";
import {getRepository} from "typeorm";
import {User} from "../entity/User";

export class AuthService {

    private userRepository = getRepository(User);
    private saltRounds = 10;

    public async preveriUpImeInGeslo(username: string, password: string): Promise<number> {
        const user: User = await this.userRepository.findOne({username: username});

        return new Promise<number>((resolve, reject) => {
            if (user === undefined) {
                reject();
            } else {
                bcrypt.compare(password, user.password).then(
                    () => {
                        resolve(user.user_id);
                    }, () => {
                        reject();
                    });
            }
        });
    }

    // public genHash(): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         bcrypt.hash("geslo123", this.saltRounds).then(
    //             (hash: string) => {
    //                 console.log(hash);
    //                 resolve(hash);
    //             }, (err) => {
    //                 reject(err);
    //             }
    //         );
    //     });
    // }
}




