const request = require("supertest")
const app = require("../server")

describe("Home Route",()=>{
    it("should return status true",async()=>{
        const response = await request(app).get("/").set("content-type","application/json")
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual({status:true})
    })

    it("should return an error when routed to undefined route",async()=>{
        const response = await request(app).get("/unknown").set("content-type","application/json")
        expect(response.status).toBe(404)
        expect(response.body).toStrictEqual({ message: 'route not found' })
    })
})
