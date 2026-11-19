const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Reply = require('../models/Reply');

// ========================
// POSTS CRUD ROUTES
// ========================

// CREATE a post -> 201
router.post('/', async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all posts -> 200
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single post (along with its replies) -> 200 or 404
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const replies = await Reply.find({ postId: post._id }).sort({ createdAt: 1 });
    res.status(200).json({ post, replies });
  } catch (err) {
    res.status(400).json({ error: 'Invalid post ID' });
  }
});

// UPDATE a post -> 200 or 404
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Returns updated doc & enforces schema rules
    );
    if (!updatedPost) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a post (and cascade-delete its replies) -> 200 or 404
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: 'Post not found' });

    await Reply.deleteMany({ postId: req.params.id });
    res.status(200).json({ message: 'Post and associated replies deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid post ID' });
  }
});

// ========================
// REPLIES CRUD ROUTES
// ========================

// CREATE a reply on a post -> 201 or 404
router.post('/:postId/replies', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const reply = await Reply.create({
      ...req.body,
      postId: req.params.postId,
    });
    res.status(201).json(reply);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all replies for a post -> 200 or 404
router.get('/:postId/replies', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const replies = await Reply.find({ postId: req.params.postId });
    res.status(200).json(replies);
  } catch (err) {
    res.status(400).json({ error: 'Invalid post ID' });
  }
});

// UPDATE a reply -> 200 or 404
router.put('/:postId/replies/:replyId', async (req, res) => {
  try {
    const updatedReply = await Reply.findOneAndUpdate(
      { _id: req.params.replyId, postId: req.params.postId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReply) return res.status(404).json({ error: 'Reply not found' });

    res.status(200).json(updatedReply);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a reply -> 200 or 404
router.delete('/:postId/replies/:replyId', async (req, res) => {
  try {
    const deletedReply = await Reply.findOneAndDelete({
      _id: req.params.replyId,
      postId: req.params.postId,
    });
    if (!deletedReply) return res.status(404).json({ error: 'Reply not found' });

    res.status(200).json({ message: 'Reply deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router;