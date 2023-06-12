const express = require('express');
const User = require('../models/UserModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const { generateToken, Authenticate } = require('../middleware/generateToken');




router.route('/login')
    .post(async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                throw new Error("Empty Fields");
            const userExists = await User.findOne({ email });
            if (!userExists)
                throw new Error("User with the email doesnot exists");
            if (!await bcrypt.compare(password, userExists.password))
                throw new Error("Password Does Not Match");
            const user = userExists;
            return res.json({
                sucess: true, token: generateToken(user), userInfo: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    token: generateToken(user)
                }
            });
        } catch (error) {
            return res.json({ sucess: false, message: error.message });
        }
    });

router.route('/signup')
    .post(async (req, res) => {
        try {
            const { name, email, password, pic } = req.body;
            console.log(req.body);
            if (!name || !email || !password)
                throw new Error("Empty Fields");
            const userExists = await User.findOne({ email });
            if (userExists)
                throw new Error("User with the email already exists");
            const userData = new User({
                name: name,
                email: email,
                password: await bcrypt.hash(password, saltRounds),
                avatar: pic ? pic : 'https://e7.pngegg.com/pngimages/581/573/png-clipart-ninja-holding-red-ninja-laptop-illustration-ninja-computer-programming-learning-study-skills-avatar-heroes-cartoon.png'
            });
            const user = await userData.save();
            return res.json({
                sucess: true,
                token: generateToken(user),
                userInfo: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    token: generateToken(user)
                }

            });
        } catch (error) {
            return res.json({ sucess: false, message: error.message });
        }
    });

router.get('/getalluser', Authenticate, async (req, res) => {
    try {
        console.log(req.query.search);
        const keyword = req.query.search ?
            {
                $or: [
                    { name: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } },
                ]
            } : {};
        console.log(keyword);
        const users = await User.
            find(keyword, { password: 0, __v: 0 })
            .find({ _id: { $ne: req.user._id } });
        return res.json({ sucess: true, users });
    } catch (error) {
        return res.json({ sucess: false, message: error.message });
    }
});


router.get('/test', Authenticate, (req, res) => {
    return res.json(req.user);
});

module.exports = router;