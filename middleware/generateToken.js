var jwt = require('jsonwebtoken');

module.exports.generateToken = ({ _id, name, email }) => {
    return jwt.sign({
        _id: _id,
        name: name,
        email: email
    }
        , process.env.secret, { expiresIn: '1d' });
};

module.exports.Authenticate = (req, res, next) => {
    try {
        if (!req.headers.authorization)
            throw new Error("NOT AUTHENTICATED");
        const userDataDecoded = jwt.verify(req.headers.authorization, process.env.secret);
        req.user = userDataDecoded;
        next();
    } catch (error) {
        return res.json({ sucess: false, message: error.message });
    }
};