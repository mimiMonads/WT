// test/routes.test.mjs

import { describe, it, expect, beforeEach, mock } from "bun:test";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";

// 1. Mock the models module before importing any code that uses it
mock.module("../backend/models/models.mjs", () => ({
  User: {
    findOne: mock(() => Promise.resolve(null)),
    findById: mock(() => Promise.resolve(null)),
    create: mock(() => Promise.resolve({})),
    find: mock(() => Promise.resolve([])),
  },
  Message: {
    find: mock(() => Promise.resolve([])),
    findById: mock(() => Promise.resolve(null)),
    create: mock(() => Promise.resolve({})),
    findOne: mock(() => Promise.resolve(null)),
  },
}));

// 2. Now import the mocked exports and your routes
import { User, Message } from "../backend/models/models.mjs";
import userRoutes from "../backend/routes/userRoutes.mjs";
import messageRoutes from "../backend/routes/messageRoutes.mjs";

// 3. Express app setup
process.env.JWT_SECRET = "testsecret";
const app = express();
app.use(express.json());
app.use("/", userRoutes);
app.use("/api/messages", messageRoutes);

// 4. Helper to generate a real JWT
function generateValidToken(userId = "mocked-user-id") {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

// 5. Reset mocks before each test
beforeEach(() => {
  mock.restore();
});

describe("User Routes", () => {
  it("GET / returns 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });

  it("GET /login returns 200", async () => {
    const res = await request(app).get("/login");
    expect(res.status).toBe(200);
  });

  it("GET /logout returns logout message", async () => {
    const res = await request(app).get("/logout");
    expect(res.status).toBe(200);
    expect(res.body.message).toContain("Logged out");
  });

  it("GET /user/:name returns 404 if user not found", async () => {
    User.findOne.mockResolvedValueOnce(null);
    const res = await request(app).get("/user/DoesNotExist");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /privacy returns 200", async () => {
    const res = await request(app).get("/privacy");
    expect(res.status).toBe(200);
  });
});

describe("Message Routes", () => {
  it("GET /api/messages returns all messages", async () => {
    Message.find.mockResolvedValueOnce([
      { _id: "m1", content: "Hello" },
      { _id: "m2", content: "World" },
    ]);
    const res = await request(app).get("/api/messages");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("POST /api/messages fails when missing fields", async () => {
    const token = generateValidToken();
    const res = await request(app)
      .post("/api/messages")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
  });

  it("GET /api/messages/:id returns message if found", async () => {
    Message.findById.mockResolvedValueOnce({
      _id: "m45",
      content: "Single message test",
    });
    const res = await request(app).get("/api/messages/m45");
    expect(res.status).toBe(200);
    expect(res.body.content).toBe("Single message test");
  });

  it("GET /api/messages/:id returns 404 if not found", async () => {
    Message.findById.mockResolvedValueOnce(null);
    const res = await request(app).get("/api/messages/noexists");
    expect(res.status).toBe(404);
  });

  it("PUT /api/messages/:id returns 404 if not found", async () => {
    Message.findById.mockResolvedValueOnce(null);
    const res = await request(app)
      .put("/api/messages/badID")
      .send({ content: "Updated content" });
    expect(res.status).toBe(404);
  });

  it("DELETE /api/messages/:id deletes message if found", async () => {
    const mockDoc = {
      _id: "m-del",
      deleteOne: mock(() => Promise.resolve(true)),
    };
    Message.findById.mockResolvedValueOnce(mockDoc);
    const res = await request(app).delete("/api/messages/m-del");
    expect(res.status).toBe(200);
    expect(mockDoc.deleteOne).toHaveBeenCalled();
  });

  it("DELETE /api/messages/:id returns 404 if not found", async () => {
    Message.findById.mockResolvedValueOnce(null);
    const res = await request(app).delete("/api/messages/noexists");
    expect(res.status).toBe(404);
  });

  it("GET /api/messages/search/:query returns matching messages", async () => {
    Message.find.mockResolvedValueOnce([
      { _id: "m300", content: "This is test content" },
    ]);
    const res = await request(app).get("/api/messages/search/test");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(Message.find).toHaveBeenCalledWith({
      content: { $regex: "test", $options: "i" },
    });
  });
});
