import {NextFunction, Request, Response} from "express";

const basePath = "D:/OneDrive - inc/FRI/3. letnik/2. semester/PKP/slike";  // TODO

const options = {
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};

module.exports.dobiSliko = function (req: Request, res: Response, next: NextFunction) {
    let pot = req.params.pot.replace(/\|/g, "/");

    res.sendFile(basePath + pot, options, (err) => {
        if (err) {
            console.log(err);
        }
    });
};