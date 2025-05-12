const Blog = require('../models/Blog');
const config = require('../config/config');

const createBlog = async (blogData, authorId) => {
    const { title } = blogData;
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
        throw new Error('Blog with this title already exists');
    }
    const newBlog = new Blog({ ...blogData, author: authorId });
    return await newBlog.save();
};

const getPublishedBlogs = async (page = 1, limit = config.defaultPageSize, filter = {}, sort = {}) => {
    const skip = (page - 1) * limit;
    const blogs = await Blog.find({ state: 'published', ...filter })
        .populate('author', 'first_name last_name') // Populate author details
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = await Blog.countDocuments({ state: 'published', ...filter });
    return {
        blogs,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
    };
};

const getPublishedBlogById = async (blogId) => {
    const blog = await Blog.findById(blogId).populate('author', 'first_name last_name');
    if (!blog || blog.state !== 'published') {
        return null;
    }
    // Increment read count
    blog.read_count += 1;
    await blog.save();
    return blog;
};

const getBlogById = async (blogId) => {
    return await Blog.findById(blogId).populate('author', 'first_name last_name');
};

const updateBlog = async (blogId, updateData) => {
    return await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
};

const deleteBlog = async (blogId) => {
    return await Blog.findByIdAndDelete(blogId);
};

const getUserBlogs = async (authorId, page = 1, limit = config.defaultPageSize, filter = {}, sort = {}) => {
    const skip = (page - 1) * limit;
    const blogs = await Blog.find({ author: authorId, ...filter })
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const total = await Blog.countDocuments({ author: authorId, ...filter });
    return {
        blogs,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
    };
};

module.exports = {
    createBlog,
    getPublishedBlogs,
    getPublishedBlogById,
    getBlogById,
    updateBlog,
    deleteBlog,
    getUserBlogs,
};