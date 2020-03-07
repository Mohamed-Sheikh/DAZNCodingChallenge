const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const dummyFile = "../../DummyData/dummyData.json";
const data = require(dummyFile);
fs = require("fs");
const uuid = require("uuid");

let test = () => {
  return true;
};

app.use(
  bodyParser.text({
    type: "*/*"
  })
);

app.get("/", (req, res) => {
  res.send("OK!");
});

app.get("/getUser", (req, res) => {
  //auth?
  try {
    let user = fetchUser(req.query.id);
    if (!user) {
      return res.sendStatus(400);
    }
    res.send(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//for unit testing purposes
app.post("/createUser", (req, res) => {
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

  data.Users[userId] = obj;
  fs.writeFile("DummyData/dummyData.json", JSON.stringify(data), err => {
    console.error("Can't update file", err);
  });

  res.send(body.Name + " created");

  //auth?
  //test the right stuff is passed in
  //get the body and append it to our json

  console.log("id is ", req.query.id);
  let UserId = req.query.id;

  res.send(data.Users[UserId]);
});

app.get("/getAllUsers", (req, res) => {
  //auth?
  //will be too big
  res.send(data);
});

app.get("/requestStream", (req, res) => {
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
      case activeStreams >= 3:
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
        fs.writeFile("DummyData/dummyData.json", JSON.stringify(data), err => {
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
