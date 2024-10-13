const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

require('dotenv').config();

const signIn = async (req, res, next) => {
    try {
        const { admin, password } = req.body;
        const dbAdmin = await Admin.findOne({ admin });
        console.log(dbAdmin);

        if (dbAdmin) {
            const isValidPassword = await bcrypt.compare(password, dbAdmin.password);
            if (isValidPassword) {
                // all is ok
                // token generation
                const token = JWT.sign(
                    { admin, role: dbAdmin.role, id: dbAdmin._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '10d' }
                );

                console.log(token);
                res.set('Access-Control-Expose-Headers', 'Authorization');

                // token add to res header
                res.set('Authorization', token);
                //res.set('authToken', token);
                res.json({
                    admin: dbAdmin,
                    status: 'Log in success'
                });
            } else {
                res.send({ status: 'password error' }).status(401);
            }
        } else {
            res.send('Auth error2').status(401);
        }
    } catch (err) {
        console.log(err.message);
        next(err.message);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const { id, password } = req.body;
        const newPassword = await bcrypt.hash(password, 10);

        const updatedAdmin = await Admin.findByIdAndUpdate(
            { _id: id },
            { password: newPassword },
            { new: true } // Options: return the updated document and run validation
        );

        if (!updatedAdmin) {
            throw new Error('Admin not found');
        }

        res.send({ status: 'updated successfully password' });
    } catch (err) {
        next(err.message);
    }
};

const signUp = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);

        const user = new User({ ...req.body, email, password: hashPassword, role });
        console.log(user);
        await user.save();
        // token make start by email and mongo table id
        const tokenPayload = { email, role: user.role, id: user._id };
        const token = JWT.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '10d'
        });
        res.set('Access-Control-Expose-Headers', 'Authorization');
        // authorization  headers  client response  has token
        res.set('Authorization', token);

        res.json({
            message: 'user created success',
            user
        }).status(200);
    } catch (err) {
        res.status(401).send(err.message);
    }
};

const getUserByToken = (req, res, next) => {
    try {
        console.log(1, 'getAdminByToken');
        res.send({
            status: 'OK',
            admin: req.tokenPayLoad
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
