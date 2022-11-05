
const mongoose = require("mongoose");
require("dotenv").config();
const request = require('supertest');
const User = require("../models/userModel");
const app = require("../server")
const CryptoJS = require("crypto-js");

describe("Authentication",()=>{
    /* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });
  
  /* Clear collections after each test */
  afterEach(async () => {
await User.deleteMany({});

  });

  /* Closing database connection after all test. */
  afterAll(async()=>{
    await mongoose.connection.close();
  })


    it("Should signup a user",async()=>{
        const response = await request(app).post("/api/v1/auth/register").set('content-type', 'application/json')
        .send({ 
            first_name : "john",
            last_name:"peter",
            username:"john",
            email:"john@gmail.com",
            password:"12345"
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('first_name', 'john')
        expect(response.body.user).toHaveProperty('last_name', 'peter')
        expect(response.body.user).toHaveProperty('username', 'john')

    })

    it("Should login a user",async()=>{
        //create user in database
      const user =  await User.create({
            first_name : "john",
            last_name:"peter",
            username:"john",
            email:"john@gmail.com",
            password:CryptoJS.AES.encrypt(
                '12345',
                process.env.PASS_SECRET
              ).toString(),
        })


        //login user
        const response = await request(app).post("/api/v1/auth/login").set("content-type","application/json").send({
            username:"john",
            password:"12345"
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('accessToken')
    })

  


})