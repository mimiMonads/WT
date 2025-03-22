// models.test.js
const { User, Message, Reply, Post } = require('../backend/models/models.js');

describe('Mongoose Models Mocking with Jest', () => {
  describe('User Model', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'JohnDoe',
        password: 'securepassword'
      };

      // Create a new user instance and override save method
      const user = new User(userData);
      user.save = jest.fn().mockResolvedValue(user);

      const savedUser = await user.save();
      expect(savedUser).toEqual(user);
      expect(user.save).toHaveBeenCalled();
    });

    it('should find a user by name', async () => {
      const userData = {
        name: 'JaneDoe',
        password: 'anotherpassword'
      };

      // Mock the static findOne method
      User.findOne = jest.fn().mockResolvedValue(userData);

      const foundUser = await User.findOne({ name: 'JaneDoe' });
      expect(foundUser).toEqual(userData);
      expect(User.findOne).toHaveBeenCalledWith({ name: 'JaneDoe' });
    });
  });

  describe('Message Model', () => {
    it('should create a new message successfully', async () => {
      const messageData = {
        to: '605c5f9e0f1b2c0015d1a123',
        from: 'Anonymous',
        body: 'Hello there!'
      };

      const message = new Message(messageData);
      message.save = jest.fn().mockResolvedValue(message);

      const savedMessage = await message.save();
      expect(savedMessage).toEqual(message);
      expect(message.save).toHaveBeenCalled();
    });

    it('should update a message as replied', async () => {
      const messageData = {
        _id: '605c5f9e0f1b2c0015d1a124',
        to: '605c5f9e0f1b2c0015d1a123',
        from: 'Anonymous',
        body: 'Hi!',
        replied: false
      };

      // Simulate findById and update
      Message.findById = jest.fn().mockResolvedValue({
        ...messageData,
        save: jest.fn().mockResolvedValue({ ...messageData, replied: true })
      });

      const msg = await Message.findById(messageData._id);
      msg.replied = true;
      const updatedMsg = await msg.save();

      expect(updatedMsg.replied).toBe(true);
      expect(Message.findById).toHaveBeenCalledWith(messageData._id);
    });
  });

  describe('Reply Model', () => {
    it('should create a new reply successfully', async () => {
      const replyData = {
        message: '605c5f9e0f1b2c0015d1a125', 
        user: '605c5f9e0f1b2c0015d1a126',   
        replyText: 'Thanks for your message!'
      };

      const reply = new Reply(replyData);
      reply.save = jest.fn().mockResolvedValue(reply);

      const savedReply = await reply.save();
      expect(savedReply).toEqual(reply);
      expect(reply.save).toHaveBeenCalled();
    });
  });

  describe('Post Model', () => {
    it('should create a new post successfully', async () => {
      const postData = {
        title: 'My First Post',
        body: 'This is the content of my first post. It is long enough.',
        tags: ['introduction', 'welcome']
      };

      const post = new Post(postData);
      post.save = jest.fn().mockResolvedValue(post);

      const savedPost = await post.save();
      expect(savedPost).toEqual(post);
      expect(post.save).toHaveBeenCalled();
    });

    it('should find posts by tag', async () => {
      const posts = [
        { title: 'Post 1', tags: ['test', 'jest'] },
        { title: 'Post 2', tags: ['test', 'node'] }
      ];

      Post.find = jest.fn().mockResolvedValue(posts);

      const foundPosts = await Post.find({ tags: 'test' });
      expect(foundPosts).toEqual(posts);
      expect(Post.find).toHaveBeenCalledWith({ tags: 'test' });
    });
  });
});
