import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({

  blogId: {
    type: String,
    required: false,
  },
  commentMessage: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false
  },
});

const Comment = mongoose.model('Comments', commentSchema);

export default Comment;
