// test/validators.test.mjs

import { beforeEach, describe, expect, mock, test } from "bun:test";

import {
  validateLogin,
  validateMessage,
  validatePost,
  validateReply,
  validateUser,
} from "../backend/validators/validators.mjs";

describe("Validator Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: mock(() => res),
      json: mock(() => {}),
    };
    next = mock(() => {});
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
        name: "ab", // too short
        password: "", // required
        privacy: "unknown", // invalid option
      };
      validateUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
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
        to: "", // required
        body: "", // empty
      };
      validateMessage(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
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
        message: "", // missing
        user: "", // missing
        replyText: "", // too short
      };
      validateReply(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
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
        title: "No", // too short
        body: "Short", // too short
      };
      validatePost(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
