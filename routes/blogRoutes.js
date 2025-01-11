const express = require('express');
const {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} = require('../controllers/blogController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createBlog); // Create blog
router.get('/', getBlogs); // Get all blogs (public)
router.get('/my-blogs', authenticate, getMyBlogs); // Get logged-in user's blogs
router.get('/:id', getSingleBlog); // Get a single blog (public)
router.put('/:id', authenticate, updateBlog); // Update blog (owner only)
router.delete('/:id', authenticate, deleteBlog); // Delete blog (owner only)

module.exports = router;
