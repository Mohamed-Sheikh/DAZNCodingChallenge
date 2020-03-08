"use strict";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const databaseDAO = require("../../Database/DatabaseDAO.js");
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
  try {
    logger.info(`${req.method} on resource ${req.path} -  Status code 200`);
    let body = JSON.parse(req.body);
    let user = addUser(body);

    if (!user) {
      return res.sendStatus(500);
    }
    return res.send(body.Name + " created");
  } catch (error) {
    logger.error(`${req.method} on resource ${req.path} -  Status code 500`);
    logger.error(`${req.method} on resource ${req.path} -  ${err}`);
    return res.sendStatus(500);
  }

  //auth?
  //test the right stuff is passed in
  //get the body and append it to our json
});

app.post("/removeUser", (req, res) => {
  try {
    logger.info(`${req.method} on resource ${req.path} -  Status code 200`);
    let id = JSON.parse(req.body).id;
    let user = removeUser(id);
    if (!user) {
      return res.sendStatus(500);
    }
    return res.send(user);
  } catch (error) {
    console.log(error);
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

app.post("/requestStream", (req, res) => {
  logger.info(`${req.method} on resource ${req.path} -  Status code 200`);
  let body = JSON.parse(req.body);
  //fix this
  try {
    let UserId = body.id;
    let stream = body.stream;
    let request = streamRequest(UserId, stream);
    if (!request) {
      res.sendStatus(400);
    }
    return res.send(request);
  } catch (err) {
    logger.error(`${req.method} on resource ${req.path} -  Status code 500`);
    logger.error(`${req.method} on resource ${req.path} -  ${err}`);
    res.sendStatus(500);
  }
});
let fetchUser = id => {
  try {
    let user = databaseDAO.getUser(id);
    return user;
  } catch (error) {
    logger.error(`Error fetching user, ${error}`);
  }
};

let addUser = body => {
  try {
    let userToAdd = databaseDAO.createUser(body);
    return userToAdd;
  } catch (error) {
    logger.error(`Error creating user, ${error}, function: ${addUser.name}`);
  }
};

let streamRequest = (id, stream) => {
  try {
    let user = fetchUser(id);
    let requestedStream = databaseDAO.addStream(id, stream, user);
    return requestedStream;
  } catch (error) {
    console.log(error);
    logger.error(
      `Error requesting stream, ${error}, function: ${streamRequest.name}`
    );
  }
};

let removeUser = id => {
  try {
    let user = databaseDAO.deleteUser(id);
    return user;
  } catch (error) {
    logger.error(
      `Error in deleting user ${id}, ${error}, function: ${removeUser.name}`
    );
  }
};

module.exports.app = app;
