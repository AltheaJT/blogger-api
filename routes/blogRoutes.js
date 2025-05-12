const express = require('express');
const {
    createNewBlog,
    getPublishedBlogsList,
    getPublishedBlogDetails,
    updateExistingBlog,
    deleteExistingBlog,
    getUserBlogsList,
    updateBlogState
} = require('../controllers/blogController');
const { authenticate, isBlogOwner } = require('../middlewares/authMiddleware');
const { validateBlog } = require('../utils/validators'); // Import blog validator

const router = express.Router();

router.post('/', authenticate, validateBlog, createNewBlog);
router.get('/', getPublishedBlogsList);
router.get('/:id', getPublishedBlogDetails);
router.put('/:id', authenticate, isBlogOwner, validateBlog, updateExistingBlog);
router.patch('/:id/state', authenticate, isBlogOwner, updateBlogState); // Added route for updating state
router.delete('/:id', authenticate, isBlogOwner, deleteExistingBlog);
router.get('/user/blogs', authenticate, getUserBlogsList);

module.exports = router;