"use strict";
const request = require("supertest");
const DAZN = require("../DAZN/src/server");

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
  test("We should have a status of 200, with the user name returned", done => {
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
        expect(response.text).toBe("Test User created");
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("Testing we can fetch users", () => {
  test("We should have a status of 200, with the user returned", done => {
    let user = {
      Name: "Test User",
      Subscription: "basic plan",
      Status: {
        Online: { Streams: { activeStreams: 0, watching: [] } },
        offline: { lastOnline: null }
      }
    };
    request(DAZN.app)
      .get("/getUser?id=010")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(JSON.stringify(response.body)).toBe(JSON.stringify(user));
        done();
      });
  });
});

describe("Testing users with less than 3 streams can request new streams", () => {
  test("We should have a status of 200", done => {
    let obj = {
      id: "010",
      stream: "stream_100"
    };
    request(DAZN.app)
      .post(`/requestStream`)
      .send(JSON.stringify(obj))
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`Request for ${obj.stream} succesful`);
        done();
      });
  });
});
describe("Testing users with more than 2 streams can't request new streams", () => {
  test("We should have a status of 200", async done => {
    let stream1 = "stream_11";
    let stream2 = "stream_12";
    let stream3 = "stream_13";
    let userId = "010";
    let obj1 = {
      id: userId,
      stream: stream1
    };
    let obj2 = {
      id: userId,
      stream: stream2
    };
    let obj3 = {
      id: userId,
      stream: stream3
    };

    //test set up
    //add first stream
    request(DAZN.app)
      .post(`/requestStream`)
      .send(JSON.stringify(obj1))
      .then(response => {});
    request(DAZN.app)
      .post(`/requestStream`)
      .send(JSON.stringify(obj2))
      .then(response => {});

    request(DAZN.app)
      .post(`/requestStream`)
      .send(JSON.stringify(obj3))
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(
          `User - ${userId} has exceeded maximum concurrent streams allowed.`
        );
        done();
      });
  });
});

describe("Testing users cannot request a stream they are currently watching", () => {
  test("We should have a status of 200", done => {
    let stream = "stream_11";
    let userId = "010";
    let obj = {
      id: userId,
      stream: stream
    };

    request(DAZN.app)
      .post(`/requestStream`)
      .send(JSON.stringify(obj))
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(
          `User ${userId} is already watching ${stream}`
        );
        done();
      });
  });
});

describe("Testing that we can remove users from database", () => {
  test("We should have a status of 200", done => {
    let obj = { id: "010" };
    request(DAZN.app)
      .post("/removeUser")
      .send(JSON.stringify(obj))
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe(`user ${obj.id} successfully deleted`);
        done();
      });
  });
});

describe("Testing that we get a status of 400 when we attempt to get user that doesn't exist", () => {
  test("We should have a status of 400", done => {
    request(DAZN.app)
      .get("/getUser?id=")
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe("Bad Request");
        done();
      });
  });
});

describe("Testing that we get a status of 200 when we make a request to get all users in database", () => {
  test("We should have a status of 200", done => {
    request(DAZN.app)
      .get("/getallusers")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(typeof response.body.Users).toBe("object");
        done();
      });
  });
});
