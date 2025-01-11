const Blog = require('../models/blog');
const calculateReadingTime = require('../utils/calculateReadingTime');

exports.createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;
    const reading_time = calculateReadingTime(body);
    const blog = await Blog.create({
      title,
      description,
      tags,
      body,
      reading_time,
      author: req.user.id,
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ message: 'Error creating blog', error });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, state, orderBy } = req.query;

    const filters = { state: 'published' };
    if (state) filters.state = state;
    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') },
        { 'author.first_name': new RegExp(search, 'i') },
        { 'author.last_name': new RegExp(search, 'i') },
      ];
    }

    const blogs = await Blog.find(filters)
      .populate('author', 'first_name last_name email')
      .sort(orderBy || '-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
};

exports.getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { read_count: 1 } },
      { new: true }
    ).populate('author', 'first_name last_name email');

    if (!blog || blog.state !== 'published') {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const blog = await Blog.findOneAndUpdate(
      { _id: id, author: req.user.id },
      updates,
      { new: true }
    );

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findOneAndDelete({ _id: id, author: req.user.id });

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error });
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;

    const filters = { author: req.user.id };
    if (state) filters.state = state;

    const blogs = await Blog.find(filters)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your blogs', error });
  }
};
