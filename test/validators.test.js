const {
  validateUser,
  validateLogin,
  validateMessage,
  validateReply,
  validatePost,
} = require("../backend/validators/validators.js");

describe("Validator Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("validateLogin", () => {
    test("passes with valid input", () => {
      req.body = { name: "testUser", password: "secret" };
      validateLogin(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("fails with invalid input", () => {
      req.body = { name: "", password: "" };
      validateLogin(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
  });

  describe("validateUser", () => {
    test("passes with valid input", () => {
      req.body = {
        name: "validUser",
        password: "password",
        profilePicture: "http://example.com/pic.png",
        status: "active",
        privacy: "public",
      };
      validateUser(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("fails with invalid input", () => {
      req.body = {
        name: "ab", // too short (min 3)
        password: "", // required
        privacy: "unknown", // not one of valid options
      };
      validateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
  });

  describe("validateMessage", () => {
    test("passes with valid input", () => {
      req.body = {
        to: "605c5f9e0f1b2c0015d1a123",
        from: "Anonymous",
        body: "Hello, this is a valid message.",
        replied: false,
      };
      validateMessage(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("fails with invalid input", () => {
      req.body = {
        to: "", // required field missing
        body: "", // too short, empty message
      };
      validateMessage(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
  });

  describe("validateReply", () => {
    test("passes with valid input", () => {
      req.body = {
        message: "605c5f9e0f1b2c0015d1a125",
        user: "605c5f9e0f1b2c0015d1a126",
        replyText: "This is a valid reply.",
      };
      validateReply(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("fails with invalid input", () => {
      req.body = {
        message: "", // missing message id
        user: "",    // missing user id
        replyText: "", // too short
      };
      validateReply(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
  });

  describe("validatePost", () => {
    test("passes with valid input", () => {
      req.body = {
        title: "Valid Title",
        body: "This is a valid body for the post, with enough content.",
        tags: ["tag1", "tag2"],
      };
      validatePost(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("fails with invalid input", () => {
      req.body = {
        title: "No", // too short (min 3)
        body: "Short", // too short (min 10)
      };
      validatePost(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
    });
  });
});
