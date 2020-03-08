# DAZNCodingChallenge

#

- Run npm install in the root directory such that all the dependencies are installed
- Run Node index.js to start the server.

# Test

- Run npm test in the root directory to run all the tests

# Notes

- Used JSON to mimic database so there is no integration test. Given the nature of the program,
  my database of choice would have been dynamoDB.
- Loggng can be found in the Middleware folder
- Omited authorizing the api as instructed in the brief

# API

- **/getuser** - Get request that takes in an "id" parameter to query the database, i.e.localhost:8080/getuser?id=001
- **/createuser** - post request that takes in a json object to add a user to the database, template:
  {
  "Name": "Van Persie",
  "Subscription": "basic plan",
  "Status": {
  "Online": {
  "Streams": {
  "activeStreams": 0,
  "watching": []
  }
  },
  "offline": { "lastOnline": null }
  }
  }
- **/removeuser** - post request that takes in a json object to remove user from the database, template:
  let obj = { id: "010" };
  id - is the user ID in the database

- **/getallusers** - get request that returns all the users in the database, given that my database is relatively small it makes sense to return it in a single call, the data is returned. For a larger database then paramters will need to be included to filter the database.

- **/requeststream** - post request that checks how many video streams a given user is watching and prevent a user
  from watching more than 3 video streams concurrently. Takes in a JSON object. template:
  let obj = {
  id: "010",
  stream: "stream_100"
  };

# How would I scale the solution to millions of users?

EC2 Instance - I would scale the solution to millions of users by deploying it on an Amazon EC2 instance. The biggest advantage of doing so is the ASG (auto scaling group) capabilities that Amazon provide. Resultantly, as the system grows in regards to traffic and number of concurrent users, so do the virtual machines running the system, as it is automatically scaled up and down to meet the desired capacity. The developer or the team is given the granularity to define when a new instance should be scaled up or down based on the configurations they define. This capability along with elastic load balancing which automatically distributes incoming application traffic across multiple targets make it a good choice.

AWS Lambda - If the system was going to a subset of the users or a significantly smaller user base, then I would deploy it on AWS Lambda. It allows for the system to be deployed as a serverless function, completely decoupling it from any systems that interact with it, making it easier to test, deploy, maintain and most importantly scale. AWS offers an autoscaling system whereby systems are automatically scaled up or down depending on their usage. In addition, by having this system run on AWS Lambda it allows for it to be easily integrated with other AWS services, such as API gateway, dynamoDB for the database and the many monitoring tools available. It can also be integrated with an existing AWS CI/CD pipeline.

# How you would approach monitoring and
