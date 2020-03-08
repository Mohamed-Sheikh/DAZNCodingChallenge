"use strict";
const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const databaseDAO = require("../../Database/DatabaseDAO.js");
const fs = require("fs");
const config = require("../../config.json");
const logger = require("../../Middleware/logger");

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
      `${req.method} request on resource ${req.path} -  Status code 200`
    );
    logger.info(
      `Successfully returned ${req.method} on resource ${req.path} -  Status code 200`
    );
    return res.sendStatus(200);
  } catch (error) {
    logger.error(`${req.method} on resource ${req.path} -  Status code 404`);
    logger.error(`${req.method} on resource ${req.path} -  error`);
    return res.sendStatus(404);
  }
});

app.get("/getUser", (req, res) => {
  logger.info(`${req.method} on resource ${req.path} -  Status code 200`);
  //auth?
  try {
    let user = fetchUser(req.query.id);
    if (!user) {
      logger.error(`${req.method} on resource ${req.path} -  Status code 400`);
      return res.sendStatus(400);
    }
    logger.info(
      `Successfully returned ${req.method} on resource ${req.path} -  Status code 200`
    );
    return res.json(user);
  } catch (error) {
    logger.error(`${req.method} on resource ${req.path} -  Status code 500`);
    logger.error(`${req.method} on resource ${req.path} -  ${error}`);
    return res.sendStatus(500);
  }
});

//for unit testing purposes
app.post("/createUser", (req, res) => {
  logger.info(`${req.method} on resource ${req.path} -  Status code 200`);
  let body = JSON.parse(req.body);
  let userId = !body.id ? uuid.v1() : body.id;
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
  return res.send(body.Name + " created");

  //auth?
  //test the right stuff is passed in
  //get the body and append it to our json
});

app.post("/removeUser", (req, res) => {
  let body = JSON.parse(req.body);
  logger.info(`${req.method} on resource ${req.path} -  Status code 200`);
  try {
    let user = fetchUser(body.id);
    if (!user) {
      logger.error(`${req.method} on resource ${req.path} -  Status code 400`);
      return res.sendStatus(400);
    }

    //Deleting user, in reality would make a call to a database to achieve this.
    delete data["Users"][body.id];
    fs.writeFile("Database/database.json", JSON.stringify(data), err => {
      console.error("Can't update file", err);
    });
    logger.info(
      `Successfully returned ${req.method} on resource ${req.path} -  Status code 200`
    );
    return res.send(`${user} successfully deleted`);
  } catch (error) {
    logger.error(`${req.method} on resource ${req.path} -  Status code 500`);
    logger.error(`${req.method} on resource ${req.path} -  ${error}`);
    res.sendStatus(500);
  }
});

app.get("/getAllUsers", (req, res) => {
  try {
    logger.info(`${req.method} on resource ${req.path} -  Status code 200`);

    //auth?
    //will be too big
    logger.info(
      `Successfully returned ${req.method} on resource ${req.path} -  Status code 200`
    );
    return res.send(data);
  } catch (error) {
    logger.error(`${req.method} on resource ${req.path} -  Status code 500`);
    logger.error(`${req.method} on resource ${req.path} -  ${error}`);
    return res.sendStatus(500);
  }
});

app.get("/requestStream", (req, res) => {
  logger.info(`${req.method} on resource ${req.path} -  Status code 200`);
  //fix this
  try {
    let UserId = req.query.id;
    let stream = req.query.stream;

    let user = fetchUser(UserId);
    if (!user) {
      logger.error(`${req.method} on resource ${req.path} -  Status code 400`);
      return res.sendStatus(400);
    }
    let activeStreams = user.Status.Online.Streams.activeStreams;
    let currentStreams = user.Status.Online.Streams.watching;

    switch (true) {
      case currentStreams.includes(stream):
        logger.info(UserId);
        res.send(`You are already watching ${stream}`);
        break;
      case activeStreams >= process.env.concurrentLimit:
        logger.info(
          `User ${UserId} has attempted to watch new stream - concurrent stream limit exceeded`
        );
        res.send(
          `User - ${UserId} has exceeded maximum concurrent streams allowed.`
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
        logger.info(
          `User ${req.query.id} has attempted to watch new stream (${stream}) - request successful`
        );
        return res.send(`Request for ${stream} succesful`);
    }
  } catch (err) {
    logger.error(`${req.method} on resource ${req.path} -  Status code 500`);
    logger.error(`${req.method} on resource ${req.path} -  ${err}`);
    res.sendStatus(500);
  }
});
let fetchUser = id => {
  try {
    let user = databaseDAO.getUser(id);
    if (!user) {
      return false;
    }
    return user;
  } catch (error) {
    logger.error(`Error fetching user, ${error}`);
  }
};

module.exports.app = app;
