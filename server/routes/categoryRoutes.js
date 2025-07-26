const express = require('express');
const { check } = require('express-validator');
const { getCategories, createCategory } = require('../controllers/categoryController');
const router = express.Router();

router.get('/', getCategories);
router.post('/', [check('name', 'Category name is required').notEmpty()], createCategory);

module.exports = router;