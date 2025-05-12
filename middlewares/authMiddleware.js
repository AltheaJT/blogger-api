const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    let token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    token = token.slice(7, token.length).trimLeft();

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = await User.findById(decoded.userId).select('-password'); // Exclude password from user object
        if (!req.user) {
            return res.status(401).json({ message: 'Invalid token, user not found' });
        }
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { // Assuming you might add roles later
            return res.status(403).json({ message: 'Not authorized' });
        }
        next();
    };
};

const isBlogOwner = async (req, res, next) => {
    try {
        const blogId = req.params.id || req.body.blogId; // Adjust based on how you pass the blog ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to perform this action on this blog' });
        }
        req.blog = blog; // Optionally attach the blog object to the request
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { authenticate, authorize, isBlogOwner };