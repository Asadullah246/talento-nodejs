const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const User = require('../user/user.model');

require('dotenv').config();

const JWT_EXPIRY_TIME = '10d';

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const dbUser = await User.findOne({ email });
        console.log(dbUser);

        if (dbUser) {
            const isValidPassword = await bcrypt.compare(password, dbUser.password);
            if (isValidPassword) {
                // all is ok
                // token generation
                const token = JWT.sign(
                    { email, role: dbUser.role, id: dbUser._id },
                    process.env.JWT_SECRET,
                    { expiresIn: JWT_EXPIRY_TIME }
                );

                // console.log(token);
                res.set('Access-Control-Expose-Headers', 'Authorization');

                // token add to res header
                res.set('Authorization', token);
                //res.set('authToken', token);
                res.json({
                    status: true,
                    user: dbUser,
                    message: 'User Log in success'
                });
            } else {
                res.send({ status: false, message: 'Password Invalid !' }).status(401);
            }
        } else {
            res.send({
                status: false,
                message: 'user not found ! '
            }).status(401);
        }
    } catch (err) {
        // console.log(err.message);
        next(err.message);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { id, email, oldPassword, newPassword } = req.body;
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        const userDb = await User.findOne({ _id: id, email, password: oldPassword });
        if (!userDb) {
            res.send({
                status: false,
                message: 'user not fund !'
            });
        }

        if (userDb) {
            const updatedPasswordUser = await User.updateOne(
                { _id: id, email },
                { password: newPasswordHash },
                { new: true }
            );
            res.send({
                message: 'updated successfully password',
                status: true,
                user: updatedPasswordUser
            });
        }
    } catch (err) {
        next(err.message);
    }
};

const signUp = async (req, res, next) => {

    try {
        const { email, password, role, userName, gender, profilePicture,uid, isVerified } = req.body;


        const hashPassword = await bcrypt.hash(password, 10);
        // console.log(hashPassword);

        const user = await User.create({
            email,
            password: hashPassword,
            role,
            userName,
            gender,
            profilePicture,uid, isVerified
        });
        console.log(user);

        const token = JWT.sign({ email, role: user.role, id: user._id }, process.env.JWT_SECRET, {
            expiresIn: JWT_EXPIRY_TIME
        });

        res.set('Access-Control-Expose-Headers', 'Authorization');
        // authorization  headers  client response  has token
        res.set('Authorization', token);

        res.json({
            status: true,
            message: 'user created success',
            user
        }).status(200);
    } catch (err) {
        res.status(401).send(err.message);
    }
};

const getUserByToken = async (req, res, next) => {
    try {
        res.send({
            status: true,
            user: req.tokenPayLoad,
            message: 'user form token'
        });
    } catch ({ message }) {
        next(message);
    }
};

const forgetPassword = async (req, res, next) => {
    try {
        res.send({
            status: true,
            user: req.tokenPayLoad,
            message: 'user form token'
        });
    } catch ({ message }) {
        next(message);
    }
};

module.exports = {
    signIn,
    changePassword,

    getUserByToken,
    signUp
};
