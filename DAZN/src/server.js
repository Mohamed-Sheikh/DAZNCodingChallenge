const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const dummyFile = "../../DummyData/dummyData.json";
const data = require(dummyFile);
fs = require("fs");

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
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

//for unit testing purposes
app.post("/createUser", (req, res) => {
  //auth?
  //get the body and append it to our json
  console.log("id is ", req.query.id);
  let UserId = req.query.id;

  res.send(data.Users[UserId]);
});

app.get("/getAllUsers", (req, res) => {
  //auth?
  console.log("id is ", req.query.id);
  res.send(data);
});

app.get("/requestStream", (req, res) => {
  //fix this
  let UserId = req.query.id;
  let stream = req.query.stream;
  try {
    let user = fetchUser(UserId);
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
  return data.Users[UserId];
};

/*
1) get user
2) How many streams are they watching 
    - if more than 3
        -call function
    -else return no of streams
3) request to watch stream
    - calls function 2
        if less < 3 =  ok!
        else: prevent them 

4) implement a health check that runs every x secs 
    return status 
    if status !200
        do something
    else 
        return

    *in theory you would use an AWS Load balancers to configure health checks 
*/

module.exports.app = app;
module.exports.test = test;
