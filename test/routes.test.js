/**
 * routes.test.js
 *
 * A comprehensive test suite covering both userRoutes and messageRoutes.
 * We mock Mongoose model calls but use a valid JWT generated with jsonwebtoken.
 */

process.env.JWT_SECRET = "testsecret"; // Ensure the secret is set for tests

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");


// Mock out the models so they don’t talk to a real DB
jest.mock("../backend/models/models.js", () => ({
  User: {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  },
  Message: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

// Do NOT mock jsonwebtoken – we want to use its real implementation.
const { User, Message } = require("../backend/models/models.js");

// Our route modules
const userRoutes = require("../backend/routes/userRoutes.js");
const messageRoutes = require("../backend/routes/messageRoutes.js");

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use("/", userRoutes);
app.use("/api/messages", messageRoutes);

// Helper function: create a valid token using the real jwt.sign
function generateValidToken(userId = "mocked-user-id") {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("should return main page text", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
    });
  });


  describe("GET /login", () => {
    it("should return the login form text", async () => {
      const res = await request(app).get("/login");
      expect(res.statusCode).toBe(200);
    });
  });


  describe("GET /logout", () => {
    it("should return a logout message", async () => {
      const res = await request(app).get("/logout");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("User logged out");
    });
  });

  describe("GET /user/:name", () => {

    it("should 404 if user not found", async () => {
      User.findOne.mockResolvedValueOnce(null);
      const res = await request(app).get("/user/DoesNotExist");
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });



  describe("GET /privacy", () => {
    it("should return privacy info", async () => {
      const res = await request(app).get("/privacy");
      expect(res.statusCode).toBe(200);
    });
  });
});

describe("Message Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/messages", () => {
    it("should fetch all messages", async () => {
      Message.find.mockResolvedValueOnce([
        { _id: "m1", content: "Hello" },
        { _id: "m2", content: "World" },
      ]);
      const res = await request(app).get("/api/messages");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe("POST /api/messages", () => {
    let token;
    beforeEach(() => {
      token = generateValidToken("mocked-user-id"); 
    });

    it("should fail if content or sender missing", async () => {
      const res = await request(app)
      .post("/api/messages").send({})
      ;
      expect(res.statusCode).toBe(500);
    });
  });

  describe("GET /api/messages/:id", () => {
    it("should get single message by id", async () => {
      Message.findById.mockResolvedValueOnce({
        _id: "m45",
        content: "Single message test",
      });

      const res = await request(app).get("/api/messages/m45");
      expect(res.statusCode).toBe(200);
      expect(res.body.content).toBe("Single message test");
    });

    it("should return 404 if message not found", async () => {
      Message.findById.mockResolvedValueOnce(null);
      const res = await request(app).get("/api/messages/noexists");
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /api/messages/:id", () => {


    it("should return 404 if not found", async () => {
      Message.findById.mockResolvedValueOnce(null);
      const res = await request(app)
        .put("/api/messages/badID")
        .send({ content: "Updated content" });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /api/messages/:id", () => {
    it("should delete a message by id", async () => {
      const mockDoc = {
        _id: "m-del",
        deleteOne: jest.fn().mockResolvedValueOnce(true),
      };
      Message.findById.mockResolvedValueOnce(mockDoc);

      const res = await request(app).delete("/api/messages/m-del");
      expect(res.statusCode).toBe(200);
      expect(mockDoc.deleteOne).toHaveBeenCalled();
    });

    it("should return 404 if not found", async () => {
      Message.findById.mockResolvedValueOnce(null);
      const res = await request(app).delete("/api/messages/noexists");
      expect(res.statusCode).toBe(404);
    });
  });

  describe("GET /api/messages/search/:query", () => {
    it("should return messages matching search", async () => {
      Message.find.mockResolvedValueOnce([
        { _id: "m300", content: "This is test content" },
      ]);
      const res = await request(app).get("/api/messages/search/test");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(Message.find).toHaveBeenCalledWith({
        content: { $regex: "test", $options: "i" },
      });
    });
  });
});
