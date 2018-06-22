import * as bcrypt from "bcrypt";
import {getRepository} from "typeorm";
import {User} from "../entity/User";

export class AuthService {

    private userRepository = getRepository(User);

    public async preveriUpImeInGeslo(username: string, password: string): Promise<number> {
        const user: User = await this.userRepository.findOne({username: username});

        if (user === undefined) {
            return -1;
        } else {
            bcrypt.compare(password, user.password).then(
                () => {
                    return user.user_id;
                }, () => {
                    return -1;
                });
        }
    }
}




