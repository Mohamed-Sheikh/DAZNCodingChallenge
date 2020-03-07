const request = require("supertest");
const DAZN = require("../DAZN/src/server");

describe("Testing the root path", () => {
  test("We should have a status of 200", done => {
    request(DAZN.app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("OK!");
        console.log("RESPONSE IS ", response.text);
        done();
      });
  });
});
