

import { Schema, model } from 'mongoose';


const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, 
    default: ''
  },
  status: {
    type: String,
    default: ''
  },
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  }
}, { timestamps: true });


const MessageSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  from: {
    type: String,
    default: 'Anonymous'
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000
  },
  replied: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


const ReplySchema = new Schema({
  message: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  replyText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 1000
  }
}, { timestamps: true });

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  body: {
    type: String,
    required: true,
    minlength: 10
  },
  tags: [{
    type: String,
    trim: true
  }],
}, { timestamps: true });

// Create and export models
const User = model('User', UserSchema);
const Message = model('Message', MessageSchema);
const Reply = model('Reply', ReplySchema);
const Post = model('Post', PostSchema);

export  {
  User,
  Message,
  Reply,
  Post
};
