const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true
  },
  media: {
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
  },
  viewers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h' 
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Story = mongoose.models.Story || mongoose.model('Story', storySchema);
export default Story
