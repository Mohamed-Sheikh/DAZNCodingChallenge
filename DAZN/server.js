const express = require("express");
const app = express();

let test = () => {
  return true;
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
