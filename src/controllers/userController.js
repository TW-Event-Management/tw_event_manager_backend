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

    const user = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        admin: req.body.admin,
    });

    try {
        const newUser = await user.save();

        //Create a session token using jwt
        const token = JWT.sign({ userId: newUser._id}, 'secretkey');
        res.status(201).json({ newUser, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
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