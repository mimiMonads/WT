
//@ts-ignore
import Joi from 'joi';

// Reusable middleware creator
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

/**
 * USER SCHEMA
 * Matches your Mongoose User model:
 *   name (String, required, unique, trim, minlength 3, maxlength 30)
 *   password (String, required)
 *   profilePicture (String, default '')
 *   status (String, default '')
 *   privacy (public, friends, private)
 */
const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  password: Joi.string().required(),
  profilePicture: Joi.string().optional().allow(''),
  status: Joi.string().optional().allow(''),
  privacy: Joi.string().valid('public', 'friends', 'private').optional()
});

/**
 * LOGIN SCHEMA
 * If you want to allow login by name/password
 * (Adjust if you actually prefer 'username' or an email instead.)
 */
const loginSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required()
});

/**
 * MESSAGE SCHEMA
 * Matches your Mongoose Message model:
 *   to (ObjectId, required)
 *   from (String, default 'Anonymous')
 *   body (String, required, 1-1000)
 *   replied (Boolean, default false)
 *
 * Here we accept `to` as a string; you can do a more robust
 * ObjectId check if you like using Joi’s pattern or custom validation.
 */
const messageSchema = Joi.object({
  to: Joi.string().required(),
  from: Joi.string().optional().allow(''), // defaults to 'Anonymous'
  body: Joi.string().min(1).max(1000).required(),
  replied: Joi.boolean().optional()
});

/**
 * REPLY SCHEMA
 * Matches your Mongoose Reply model:
 *   message (ObjectId, required)
 *   user (ObjectId, required)
 *   replyText (String, required, 1-1000)
 */
const replySchema = Joi.object({
  message: Joi.string().required(),
  user: Joi.string().required(),
  replyText: Joi.string().min(1).max(1000).required()
});

/**
 * POST SCHEMA
 * Matches your Mongoose Post model:
 *   title (String, required, 3-100)
 *   body (String, required, min 10)
 *   tags (array of strings)
 */
const postSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  body: Joi.string().min(10).required(),
  tags: Joi.array().items(Joi.string()).optional()
});

const exp =  {
  // Reuse your validate function with each schema as needed
  validateUser: validate(userSchema),
  validateLogin: validate(loginSchema),
  validateMessage: validate(messageSchema),
  validateReply: validate(replySchema),
  validatePost: validate(postSchema)
};

export const validateUser = validate(userSchema);
export const validateLogin = validate(loginSchema);
export const validateMessage = validate(messageSchema);
export const validateReply = validate(replySchema);
export const validatePost = validate(postSchema);

export {
  userSchema,
  loginSchema,
  messageSchema,
  replySchema,
  postSchema
};