const blogService = require('../services/blogService');
const { validationResult } = require('express-validator');
const { calculateReadingTime } = require('../utils/helpers');

const createNewBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const reading_time = calculateReadingTime(req.body.body);
        const blog = await blogService.createBlog({ ...req.body, reading_time }, req.user._id);
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPublishedBlogsList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || config.defaultPageSize;
    const filter = {};
    const sort = {};

    if (req.query.state) filter.state = req.query.state;
    if (req.query.author) filter['author.first_name'] = { $regex: req.query.author, $options: 'i' }; // Search by author name
    if (req.query.title) filter.title = { $regex: req.query.title, $options: 'i' };
    if (req.query.tags) filter.tags = { $in: Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags] };

    if (req.query.sortBy) {
        const [field, order] = req.query.sortBy.split(':');
        sort[field] = order === 'desc' ? -1 : 1;
    } else {
        sort.timestamp = -1; // Default sort by latest
    }

    try {
        const result = await blogService.getPublishedBlogs(page, limit, filter, sort);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPublishedBlogDetails = async (req, res) => {
    try {
        const blog = await blogService.getPublishedBlogById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateExistingBlog = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const reading_time = req.body.body ? calculateReadingTime(req.body.body) : req.blog.reading_time;
        const updatedBlog = await blogService.updateBlog(req.params.id, { ...req.body, reading_time });
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlogState = async (req, res) => {
    try {
        const updatedBlog = await blogService.updateBlog(req.params.id, { state: req.body.state });
        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteExistingBlog = async (req, res) => {
    try {
        const deletedBlog = await blogService.deleteBlog(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(204).send(); // No content on successful deletion
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserBlogsList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || config.defaultPageSize;
    const filter = {};
    const sort = {};

    filter.author = req.user._id;

    if (req.query.state) filter.state = req.query.state;

    if (req.query.sortBy) {
        const [field, order] = req.query.sortBy.split(':');
        sort[field] = order === 'desc' ? -1 : 1;
    } else {
        sort.timestamp = -1;
    }

    try {
        const result = await blogService.getUserBlogs(req.user._id, page, limit, filter, sort);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createNewBlog,
    getPublishedBlogsList,
    getPublishedBlogDetails,
    updateExistingBlog,
    deleteExistingBlog,
    getUserBlogsList,
    updateBlogState
};
