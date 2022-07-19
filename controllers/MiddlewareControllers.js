const jwt = require('jsonwebtoken')

const MiddlewareControllers = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];

            jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err, user) => {
                if (err) { res.status(403).json("Token is not valid"); }

                req.user = user;
                console.log(req.user);
                next();
            })
        } else {
            res.status(401).json("You're not authenticated");
        }
    },

    verifyTokenAndAdmin: (req, res, next) => {
        MiddlewareControllers.verifyToken(req, res, () => {
            if (req.user.id === req.params.id || req.user.admin) {
                next();
            } else {
                res.status(403).json("You're not allowed delete other")
            }
        })
    }
}


module.exports = MiddlewareControllers;