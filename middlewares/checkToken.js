const JWT = require('jsonwebtoken');
const User = require('../modules/user/user.model');

require('dotenv').config();

const checkToken = async (req, res, next) => {
    // console.log(1);
    const { authorization } = req.headers;
    // console.log(authorization, 101);

    if (!authorization) {
        res.status(401).send({
            status: false,
            message: 'Unauthorized 1 ! header authentication not found !'
        });
    } else {
        try {
            // console.log(authorization);
            const token = authorization.split(' ')[1];
            // console.log(token, 'check token');

            const decode = JWT.verify(token, process.env.JWT_SECRET);
            // check to database again !
            // console.log(decode);

            const userDb = await User.findOne({
                $and: [{ email: decode.email }, { role: decode.role }, { _id: decode.id }]
            });

            // if user not found in database
            if (!userDb) {
                res.status(401).send({
                    status: false,
                    message: 'User not found ! '
                });
            }
            if (userDb) {
                // all ok !
                req.tokenPayLoad = userDb;

                // console.log(userDb, 'userDB form checkToken');
            }
        

            next();
        } catch ({ message }) {
            next(message);
        }
    }
};

module.exports = {
    checkToken
};
