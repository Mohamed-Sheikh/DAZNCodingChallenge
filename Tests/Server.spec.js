"use strict";
const request = require("supertest");
const DAZN = require("../DAZN/src/server");
const axios = require("axios");

describe("Testing the root path", () => {
  test("We should have a status of 200", done => {
    request(DAZN.app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("Testing user can be created", () => {
  test("We should have a status of 200", done => {
    let body = {
      Name: "Test User",
      id: "010",
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
        console.log("!!!", response);
        expect(response.text).toBe("Test User created");
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

// describe("Testing we can fetch users", () => {
//   test("We should have a status of 200", done => {
//     let user = {
//       Name: "Test User",
//       Subscription: "basic plan",
//       Status: {
//         Online: {
//           Streams: {
//             activeStreams: 0,
//             watching: []
//           }
//         },
//         offline: { lastOnline: null }
//       }
//     };
//     request(DAZN.app)
//       .get("/getUser?id=010")
//       .then(response => {
//         expect(response.statusCode).toBe(200);
//         expect(response.JSON).toBe(JSON.stringify(user));
//         done();
//       });
//   });
// });

// describe("Testing users with less than 3 streams can request new streams", () => {
//   test("We should have a status of 200", done => {
//     let stream = "stream_10";
//     let userId = "010";
//     request(DAZN.app)
//       .get(`/requestStream?id=${userId}&stream=${stream}`)
//       .then(response => {
//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe(`Request for ${stream} succesful`);
//         done();
//       });
//   });
// });
// describe("Testing users with more than 2 streams can't request new streams", () => {
//   test("We should have a status of 200", async done => {
//     let stream1 = "stream_11";
//     let stream2 = "stream_12";
//     let stream3 = "stream_13";
//     let userId = "010";
//     //test set up
//     //add first stream
//     request(DAZN.app).get(`/requestStream?id=${userId}&stream=${stream1}`);
//     request(DAZN.app).get(`/requestStream?id=${userId}&stream=${stream2}`);

//     request(DAZN.app)
//       .get(`/requestStream?id=${userId}&stream=${stream3}`)
//       .then(response => {
//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe(
//           `User - ${UserId} has exceeded maximum concurrent streams allowed.`
//         );
//         done();
//       });
//   });
// });
// describe("Testing users cannot request a stream they are current watching", async () => {
//   test("We should have a status of 200", done => {
//     let stream = "stream_11";
//     let userId = "010";
//     request(DAZN.app)
//       .get(`/requestStream?id=${userId}&stream=${stream}`)
//       .then(response => {
//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe(`You are already watching ${stream}`);
//         done();
//       });
//   });
// });

// describe("Testing that we can remove users from database", async () => {
//   test("We should have a status of 200", done => {
//     let obj = { id: "010" };
//     request(DAZN.app)
//       .post("/removeUser")
//       .send(JSON.stringify(obj))
//       .then(response => {
//         expect(response.statusCode).toBe(200);
//         expect(response.text).toBe(`${obj.id} successfully deleted`);
//         done();
//       });
//   });
// });
