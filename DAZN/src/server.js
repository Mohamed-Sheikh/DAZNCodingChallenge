const express = require("express");
const axios = require("axios");
const app = express();
const data = require("../../DummyData/dummyData.json");

let test = () => {
  return true;
};

app.get("/", (req, res) => {
  res.send("OK!");
});

app.get("/getUser", (req, res) => {
  //auth?
  console.log("id is ", req.query.id);
  let UserId = req.query.id;

  res.send(data.Users[UserId]);
});

app.get("/getAllUsers", (req, res) => {
  //auth
  console.log("id is ", req.query.id);
  let UserId = req.query.id;
  res.send(data);
});

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
