import * as bcrypt from "bcrypt";
import {getRepository} from "typeorm";
import {User} from "../entity/User";
import {stringify} from "querystring";

module.exports = class AuthService {

    private userRepository = getRepository(User);

    public async preveriUpImeInGeslo(username: string, password: string): Promise<User> {

        let user: User = await this.userRepository.findOne({select: ["username", "password", "active", "userId", "roleId"], where: {username: username}, relations: ["roleId"]});

        return new Promise<User>((resolve, reject) => {
            if (user === undefined || user.active === false) {
                reject();
            } else {
                bcrypt.compare(password, user.password).then(
                    (success) => {
                        if (success) {
                            resolve(user);
                        } else {
                            reject();
                        }
                    });
            }
        });
    };
};