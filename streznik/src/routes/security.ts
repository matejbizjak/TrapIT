module.exports.jeAdmin = function (req, res, next) {
    if (req.payload.userRole === "admin") {
        next();
    } else {
        res.status(401);
        res.json({sporocilo: "Napaka! Nimate ustrezne vloge!"});
    }
};

module.exports.jeReviewer = function (req, res, next) {
    if (req.payload.userRole === "reviewer") {
        next();
    } else {
        res.status(401);
        res.json({sporocilo: "Napaka! Nimate ustrezne vloge!"});
    }
};

module.exports.jeViewer = function (req, res, next) {
    if (req.payload.userRole === "viewer") {
        next();
    } else {
        res.status(401);
        res.json({sporocilo: "Napaka! Nimate ustrezne vloge!"});
    }
};