const request = require("supertest")
const app = require("../server")
const mongoose = require("mongoose");
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const Blog = require("../models/blogModel");



describe("Blog Route", () => {

  /* Clear collections after each test */
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });


  afterEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
  })

  /* Closing database connection after all test. */
  afterAll(async () => {
    await mongoose.connection.close();
  })

  it("should create a blog post", async () => {
    await User.create({
      first_name: "john",
      last_name: "peter",
      username: "john",
      email: "john@gmail.com",
      password: CryptoJS.AES.encrypt(
        '12345',
        process.env.PASS_SECRET
      ).toString(),
    })

    //login user
    const loginResponse = await request(app).post("/api/v1/auth/login").set("content-type", "application/json").send({
      username: "john",
      password: "12345"
    })

    let token = loginResponse.body.token;


    const response = await request(app).post("/api/v1/blog/").set("content-type", "application/json").set('authorization', `Bearer ${token}`).send({
      title: "this is the title",
      body: "During an earthquake, high temperatures can develop at the fault plane so increasing pore pressure consequently to vaporization of the ground water already contained within rock.[22][23][24] In the coseismic phase"
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status')
    expect(response.body).toHaveProperty('blog')



  })
})