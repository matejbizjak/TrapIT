import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export class UserController {

    private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find({relations: ["roleId"]});
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        await this.userRepository.remove(request.params.id);
    }

}

module.exports.getAll = function (req: Request, res: Response, next: NextFunction) {
    const userController = new UserController();
    userController.all(req, res, next).then((users: User[]) => {
        res.status(200).json({users: users});
    }, (err) => {
        res.status(500);
    });
};

module.exports.update = function (req: Request, res: Response, next: NextFunction) {
    const userController = new UserController();
    userController.save(req, res, next).then(() => {
        res.status(200).json();
    }, (err) => {
        console.log(err);
        res.status(500).json();
    });
};

module.exports.delete = function (req: Request, res: Response, next: NextFunction) {
    const userController = new UserController();
    userController.one(req, res, next).then((user: User) => {
        req.params.id = user;
        userController.remove(req, res, next).then(() => {
            res.status(200).json();
        }, (err) => {
            console.log(err);
            res.status(500).json();
        });
    }, (err) => {
        console.log(err);
        res.status(500).json();
    });
};
