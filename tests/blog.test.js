const request = require("supertest")
const app = require("../server")
const mongoose = require("mongoose");
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const Blog = require("../models/blogModel");



describe("Blog Route", () => {

  /* Clear collections after each test */
  beforeAll(async () => {
    jest.setTimeout(100000);
    mongoose.connect(process.env.MONGO_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
  });

  /* Closing database connection after all test. */
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should create a blog post", async () => {
    //Register user
    await request(app)
      .post("/api/v1/auth/register")
      .set("content-type", "application/json")
      .send({
        first_name: "diepiriye",
        last_name: "george",
        username: "george",
        email: "george@gmail.com",
        password: "12345",
      });

    //login user
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .set("content-type", "application/json")
      .send({
        username: "george",
        password: "12345",
      });

    //get user token
    let token = loginResponse.body.accessToken;

    //create blog for user
    const response = await request(app)
      .post("/api/v1/blog/")
      .set("content-type", "application/json")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "this is the title",
        body: "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("blog");
  }, 100000);

  it("should get a single blog post", async () => {
    //Register user
    await request(app)
      .post("/api/v1/auth/register")
      .set("content-type", "application/json")
      .send({
        first_name: "diepiriye",
        last_name: "george",
        username: "george",
        email: "george@gmail.com",
        password: "12345",
      });

    //login user
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .set("content-type", "application/json")
      .send({
        username: "george",
        password: "12345",
      });

    //get user token
    let token = loginResponse.body.accessToken;

    //create blog for user
    const createBlogResponse = await request(app)
      .post("/api/v1/blog/")
      .set("content-type", "application/json")
      .set("authorization", `Bearer ${token}`)
      .send({
        title: "this is the title",
        body: "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.",
      });

    const blogId = createBlogResponse.body.blog._id;

    const response = await request(app)
      .get(`/api/v1/blog/${blogId}`)
      .set("content-type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("blog");
  }, 100000);


})