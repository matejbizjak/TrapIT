import * as bcrypt from "bcrypt";
import {getRepository} from "typeorm";
import {User} from "../entity/User";

module.exports = class AuthService {

    private userRepository = getRepository(User);

    public async preveriUpImeInGeslo(username: string, password: string): Promise<User> {
        const user: User = await this.userRepository.findOne({where: {username: username}, relations: ["role_id"]});

        return new Promise<User>((resolve, reject) => {
            if (user === undefined) {
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