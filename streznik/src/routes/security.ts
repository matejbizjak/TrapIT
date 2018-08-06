module.exports.jeAdmin = function (req, res, next) {
    if (req.payload.user_info.roleId.role === "admin") {
        next();
    } else {
        res.status(401);
        res.json({sporocilo: "Napaka! Nimate ustrezne vloge!"});
    }
};

module.exports.jeReviewer = function (req, res, next) {
    if (req.payload.user_info.roleId.role === "reviewer") {
        next();
    } else {
        res.status(401);
        res.json({sporocilo: "Napaka! Nimate ustrezne vloge!"});
    }
};

module.exports.jeViewer = function (req, res, next) {
    if (req.payload.user_info.roleId.role === "viewer") {
        next();
    } else {
        res.status(401);
        res.json({sporocilo: "Napaka! Nimate ustrezne vloge!"});
    }
};