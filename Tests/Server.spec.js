"use strict";
const request = require("supertest");
const DAZN = require("../DAZN/src/server");

describe("Testing the root path", () => {
  test("We should have a status of 200", done => {
    request(DAZN.app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("OK!");
        done();
      });
  });
});

describe("Testing the we can create a test user", () => {
  test("We should have a status of 200", done => {
    let body = {
      Name: "Test User",
      Subscription: "basic plan",
      Status: {
        Online: {
          Streams: {
            activeStreams: 0,
            watching: []
          }
        },
        offline: { lastOnline: null }
      }
    };
    request(DAZN.app)
      .post("/createUser")
      .send(JSON.stringify(body))
      .then(response => {
        expect(response.text).toBe("Test User created");
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

// describe("Testing the we can fetch our dummy user", () => {
//   test("We should have a status of 200", done => {
//     request(DAZN.app)
//       .get("/")
//       .then(response => {
//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe("OK!");
//         console.log("RESPONSE IS ", response.text);
//         done();
//       });
//   });
// });

// describe("Testing that users cannot watch more than 3 streams", () => {
//   test("We should have a status of 200", done => {
//     request(DAZN.app)
//       .get("/")
//       .then(response => {
//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe("OK!");
//         console.log("RESPONSE IS ", response.text);
//         done();
//       });
//   });
// });

//get stream that doesnt exist.

//get user that doesnt exist

//have the ability to create a fake user
