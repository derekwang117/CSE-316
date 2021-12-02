const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                userName: savedUser.userName
            }
        }).send();
    })
}

login = async (req, res) => {
    try {
        const { email, userName, password } = req.body;
        if (!email || !userName || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        let existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            existingUser = await User.findOne({ userName: userName })
            if (!existingUser) {
                return res
                    .status(400)
                    .json({ errorMessage: "wrong email or username." })
            }
        }
        bcrypt.compare(password, existingUser.passwordHash, function (err, result) {
            if (!result) {
                return res
                    .status(400)
                    .json({ errorMessage: "wrong password." });
            }
            else {
                // LOGIN THE USER
                const token = auth.signToken(existingUser);

                return res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                }).status(200).json({
                    success: true,
                    user: {
                        firstName: existingUser.firstName,
                        lastName: existingUser.lastName,
                        email: existingUser.email,
                        userName: existingUser.userName
                    }
                }).send();
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, userName, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !userName || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        existingUser = await User.findOne({ userName: userName });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, userName, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                userName: savedUser.userName
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

getLogout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            loggedIn: false,
            user: {
                firstName: null,
                lastName: null,
                email: null,
                userName: null
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    getLogout,
    login,
    registerUser
}