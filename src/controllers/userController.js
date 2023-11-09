const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    //check for existing user with email

    const mail = req.body.mail;
    const existingUser = await User.findOne({ mail });

    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    //Hash user's password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        admin: req.body.admin,
    });

    try {
        const newUser = await user.save();

        //Create a session token using jwt
        const token = JWT.sign({ userId: newUser._id }, 'secretkey');
        res.status(201).json({ newUser, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.loginUser = async (req, res) => {
    const email = req.body.email;

    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.status(401).json({ message: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(req.body.password, userExists.password);
    if (!validPassword) {
        return res.status(401).json({ message: "Invalid password" });
    }

    try {
        const token = JWT.sign({ userId: userExists._id }, 'secretkey');
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.verifyToken = async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.json({ auth: false });
    }

    try {
        const decodedToken = JWT.decode(token, 'secretkey');
        const userId = decodedToken.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ auth: false });
        }

        return res.json({ auth: true, user });
    } catch (err) {
        console.error(err);
        return res.json({ auth: false });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.remove();
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}