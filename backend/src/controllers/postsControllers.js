const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const posts = [];

const createPost = (req, res) => {
  const { title, caption, allowComments } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const newPost = {
    id: Date.now().toString(),
    title,
    caption,
    image,
    allowComments: allowComments === 'true',
  };

  posts.unshift(newPost);

  return res.status(201).json(newPost);
};

const getPosts = (req, res) => {
  res.json(posts);
};

module.exports = { upload, createPost, getPosts };
