const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signUp = async (userData) => {
    const { email, password, ...rest } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }
    const user = new User({ email, password, ...rest });
    await user.save();
    return { message: 'User registered successfully' };
};

const signIn = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const payload = { userId: user._id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });
    return { token };
};

module.exports = { signUp, signIn };