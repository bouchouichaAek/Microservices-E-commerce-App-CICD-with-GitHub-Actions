import request from "supertest";
import users from "../routes/user.route.js";
import express from "express";

const app = express();

app.use("/", users);

describe("User API Tests", () => {
  it("should return 401 for unknown route", async () => {
    const res = await request(app).get("/not-found");
    expect(res.statusCode).toBe(401);
  });

  // Add other tests here...
});
