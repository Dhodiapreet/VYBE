const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const ApiError = require('../../utils/ApiError');
const Discussion = require('./discussion.model');
const { z } = require('zod');

// Validation schemas
const createDiscussionSchema = z.object({
  movieId: z.string().min(1),
  title: z.string().min(3).max(100),
  body: z.string().min(3),
  tags: z.array(z.string()).optional(),
  hasSpoiler: z.boolean().optional()
});

const replySchema = z.object({
  body: z.string().min(1)
});

exports.getDiscussionsByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const discussions = await Discussion.find({ movieId })
    .populate('author', 'username displayName profilePicture')
    .populate('replies.author', 'username displayName profilePicture')
    .sort('-createdAt');

  // Format to match frontend expectations
  const formatted = discussions.map(d => ({
    id: d._id,
    movieId: d.movieId,
    author: {
      id: d.author._id,
      name: d.author.displayName || d.author.username,
      username: d.author.username,
      avatar: d.author.profilePicture || d.author.username?.charAt(0).toUpperCase()
    },
    title: d.title,
    body: d.body,
    tags: d.tags || [],
    hasSpoiler: d.hasSpoiler,
    likes: d.likes.length,
    isLiked: req.user ? d.likes.some(id => id.toString() === req.user._id.toString()) : false,
    timestamp: d.createdAt,
    replies: d.replies.map(r => ({
      id: r._id,
      author: {
        id: r.author._id,
        name: r.author.displayName || r.author.username,
        username: r.author.username,
        avatar: r.author.profilePicture || r.author.username?.charAt(0).toUpperCase()
      },
      body: r.body,
      timestamp: r.createdAt
    }))
  }));

  res.status(200).json(new ApiResponse(200, formatted, 'Discussions retrieved'));
});

exports.createDiscussion = asyncHandler(async (req, res) => {
  const validationResult = createDiscussionSchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ApiError(400, 'Validation Error', validationResult.error.errors);
  }

  const { movieId, title, body, tags, hasSpoiler } = validationResult.data;

  const newDiscussion = await Discussion.create({
    movieId,
    author: req.user._id,
    title,
    body,
    tags: tags || [],
    hasSpoiler: hasSpoiler || false
  });

  const populatedDiscussion = await Discussion.findById(newDiscussion._id)
    .populate('author', 'username displayName profilePicture');

  res.status(201).json(new ApiResponse(201, {
    id: populatedDiscussion._id,
    movieId: populatedDiscussion.movieId,
    author: {
      id: populatedDiscussion.author._id,
      name: populatedDiscussion.author.displayName || populatedDiscussion.author.username,
      username: populatedDiscussion.author.username,
      avatar: populatedDiscussion.author.profilePicture || populatedDiscussion.author.username?.charAt(0).toUpperCase()
    },
    title: populatedDiscussion.title,
    body: populatedDiscussion.body,
    tags: populatedDiscussion.tags,
    hasSpoiler: populatedDiscussion.hasSpoiler,
    likes: 0,
    isLiked: false,
    timestamp: populatedDiscussion.createdAt,
    replies: []
  }, 'Discussion created'));
});

exports.toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const discussion = await Discussion.findById(id);
  
  if (!discussion) {
    throw new ApiError(404, 'Discussion not found');
  }

  const index = discussion.likes.findIndex(userId => userId.toString() === req.user._id.toString());
  
  if (index === -1) {
    discussion.likes.push(req.user._id);
    // Notification for discussion like
    if (discussion.author.toString() !== req.user._id.toString()) {
      const Notification = require('../notifications/notification.model');
      await Notification.findOneAndUpdate(
        { recipient: discussion.author, type: 'like', actor: req.user._id, 'target.id': discussion.movieId },
        {
          recipient: discussion.author,
          type: 'like',
          actor: req.user._id,
          action: 'liked your discussion on',
          target: { title: discussion.title, id: discussion.movieId },
          isRead: false
        },
        { upsert: true, new: true }
      );
    }
  } else {
    discussion.likes.splice(index, 1);
  }

  await discussion.save();

  res.status(200).json(new ApiResponse(200, {
    likes: discussion.likes.length,
    isLiked: index === -1
  }, 'Like toggled'));
});

exports.addReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const validationResult = replySchema.safeParse(req.body);
  if (!validationResult.success) {
    throw new ApiError(400, 'Validation Error', validationResult.error.errors);
  }

  const discussion = await Discussion.findById(id);
  if (!discussion) {
    throw new ApiError(404, 'Discussion not found');
  }

  discussion.replies.push({
    author: req.user._id,
    body: validationResult.data.body
  });

  await discussion.save();
  
  const updatedDiscussion = await Discussion.findById(id)
    .populate('replies.author', 'username displayName profilePicture');
    
  const newReply = updatedDiscussion.replies[updatedDiscussion.replies.length - 1];

  // Notification for discussion reply
  if (discussion.author.toString() !== req.user._id.toString()) {
    const Notification = require('../notifications/notification.model');
    await Notification.create({
      recipient: discussion.author,
      type: 'reply',
      actor: req.user._id,
      action: 'replied to your discussion on',
      target: { title: discussion.title, id: discussion.movieId }, // Frontend link targets movieId for replies
      isRead: false
    });
  }

  res.status(201).json(new ApiResponse(201, {
    id: newReply._id,
    author: {
      id: newReply.author._id,
      name: newReply.author.displayName || newReply.author.username,
      username: newReply.author.username,
      avatar: newReply.author.profilePicture || newReply.author.username?.charAt(0).toUpperCase()
    },
    body: newReply.body,
    timestamp: newReply.createdAt
  }, 'Reply added'));
});
