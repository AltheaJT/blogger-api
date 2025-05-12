const authService = require('../services/authService');
const { validationResult } = require('express-validator');

const signUpUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const result = await authService.signUp(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const signInUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const { token } = await authService.signIn(email, password);
        res.json({ token });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = { signUpUser, signInUser };