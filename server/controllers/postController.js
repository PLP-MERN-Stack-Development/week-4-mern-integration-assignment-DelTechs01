const Post = require('../models/Post');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;
    const query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    };
    if (category) query.category = category;

    const posts = await Post.find(query)
      .populate('category')
      .populate('author', 'username')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Post.countDocuments(query);

    res.json({ posts, total });
  } catch (error) {
    throw new Error('Error fetching posts');
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category')
      .populate('author', 'username')
      .populate('comments');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    throw new Error('Error fetching post');
  }
};

exports.createPost = [
  upload.single('image'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const post = new Post({
        ...req.body,
        image: req.file ? req.file.path : null,
        author: req.user.id,
      });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      throw new Error('Error creating post');
    }
  },
];

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    throw new Error('Error updating post');
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    throw new Error('Error deleting post');
  }
};