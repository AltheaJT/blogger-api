const userService = require('../services/userService');

const getUserProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
};