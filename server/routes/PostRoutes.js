const express = require('express');
const { check } = require('express-validator');
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post(
  '/',
  auth,
  [
    check('title', 'Title is required').notEmpty(),
    check('content', 'Content is required').notEmpty(),
    check('category', 'Category is required').notEmpty(),
  ],
  createPost
);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;