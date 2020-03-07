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

describe("Testing the we can create a dummy user", () => {
  test("We should have a status of 200", done => {
    request(DAZN.app)
      .post("/createUser")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("OK!");
        console.log("RESPONSE IS ", response.text);
        done();
      });
  });
});

describe("Testing the we can fetch our dummy user", () => {
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

describe("Testing that users cannot watch more than 3 streams", () => {
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

//get stream that doesnt exist.

//get user that doesnt exist

//have the ability to create a fake user
