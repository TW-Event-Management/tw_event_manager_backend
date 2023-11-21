const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    //check for existing user with email

    const email = req.body.email;
    const existingUser = await User.findOne({ email });

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

    const email = req.body.mail;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        return res.status(409).json({ error: 'User not found.' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);

    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    try {
        const token = JWT.sign({ userId: existingUser._id }, 'secretKey');
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
    const id = req.params.id;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}