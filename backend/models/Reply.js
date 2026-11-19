const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Links this reply to a specific Post
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Reply content is required'],
    },
    author: {
      type: String,
      default: 'Anonymous',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reply', replySchema);