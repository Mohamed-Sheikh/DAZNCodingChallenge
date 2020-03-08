"use strict";
const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const database = "../../Database/database.json";
const data = require(database);
const fs = require("fs");
const uuid = require("uuid");
const config = require("../../config.json");
const logger = require("../../Middleware/logger");
console.log("FINL", logger);

//Using local environment variables
process.env = config;

logger.info("Server running");

app.use(
  bodyParser.text({
    type: "*/*"
  })
);

app.get("/", (req, res) => {
  try {
    logger.info(
      `${req.query.method} on resource ${req.query.path} -  Status code 200`
    );
    logger.info("");
    return res.sendStatus(200);
  } catch (error) {
    logger.error(
      `${req.query.method} on resource ${req.query.path} -  Status code 404`
    );
    return res.sendStatus(404);
  }
});

app.get("/getUser", (req, res) => {
  logger.info(
    `${req.query.method} on resource ${req.query.path} -  Status code 200`
  );
  //auth?
  try {
    let user = fetchUser(req.query.id);
    if (!user) {
      return res.sendStatus(400);
    }
    return res.json(user);
  } catch (error) {
    logger.error(
      `${req.query.method} on resource ${req.query.path} -  Status code 404`
    );
    return res.sendStatus(500);
  }
});

//for unit testing purposes
app.post("/createUser", (req, res) => {
  logger.info(
    `${req.query.method} on resource ${req.query.path} -  Status code 200`
  );
  let body = JSON.parse(req.body);
  let userId = uuid.v1();
  let obj = {
    Name: body.Name,
    Subscription: body.Subscription,
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

  console.log("OBJ IS", obj);

  data.Users[userId] = obj;
  console.log("DATA IS", data);
  fs.writeFile("Database/database.json", JSON.stringify(data), err => {
    if (err) {
      console.error("Can't update file--", err);
    }
  });
  res.send(body.Name + " created");

  //auth?
  //test the right stuff is passed in
  //get the body and append it to our json

  console.log("id is ", req.query.id);
  let UserId = req.query.id;

  res.send(data.Users[UserId]);
});

app.get("/removeUser", (req, res) => {
  logger.info(
    `${req.query.method} on resource ${req.query.path} -  Status code 200`
  );
  try {
    let user = fetchUser(req.query.id);
    if (!user) {
      res.json(`User ${req.id}not found`);
      return res.sendStatus(400);
    }

    //Deleting user, in reality would make a call to a database to achieve this.
    delete data["Users"][req.query.id];
    fs.writeFile("Database/database.json", JSON.stringify(data), err => {
      console.error("Can't update file", err);
    });
    res.json(`User ${user.Name} Deleted`);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/getAllUsers", (req, res) => {
  logger.info(
    `${req.query.method} on resource ${req.query.path} -  Status code 200`
  );

  //auth?
  //will be too big
  logger.info(`Successfully sent: Status code 200`);
  res.send(data);
});

app.get("/requestStream", (req, res) => {
  logger.info(
    `${req.query.method} on resource ${req.query.path} -  Status code 200`
  );
  //fix this
  try {
    let UserId = req.query.id;
    let stream = req.query.stream;

    let user = fetchUser(UserId);
    if (!user) {
      return res.sendStatus(400);
    }
    let activeStreams = user.Status.Online.Streams.activeStreams;
    let currentStreams = user.Status.Online.Streams.watching;

    switch (true) {
      case currentStreams.includes(stream):
        res.send(`You are already watching ${stream}`);
        break;
      case activeStreams >= process.env.concurrentLimit:
        res.send(
          `User - ${user.Name} has exceeded maximum concurrent streams allowed.`
        );
        break;
      default:
        /*in reality would write to a database,
          database of choice being DynamoDb, 
          writing to a local json file to mimic
          data */

        activeStreams += 1;
        data.Users[UserId].Status.Online.Streams.activeStreams = activeStreams;
        data.Users[UserId].Status.Online.Streams.watching.push(
          stream.toLowerCase()
        );
        fs.writeFile("Database/database.json", JSON.stringify(data), err => {
          console.error("Can't update file", err);
        });
        res.send(`Request for ${stream} succesful`);
    }
  } catch (err) {
    console.error(err);
  }
});
let fetchUser = id => {
  console.log("id is ", id);
  let UserId = id;
  if (!data.Users[UserId]) {
    return false;
  }
  return data.Users[UserId];
};

module.exports.app = app;
module.exports.test = test;
