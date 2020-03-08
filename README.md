# DAZNCodingChallenge

#

- Run npm install in the root directory such that all the dependencies are installed
- Run Node index.js to start the server.

# Test

- Run npm test in the root directory to run all the tests

# Notes

- Used JSON to mimic database, given the nature of the program,
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

1. AWS Lambda - It allows for this system to be deployed as a serverless function, completely decoupling it from any
   existing systems that interact with it, making it easier to test, deploy, maintain and most importantly scale.
   AWS offers an autoscaling system whereby systems are automatically scaled up or down depending on their usage.
   In addition, by having this system run on AWS Lambda it allows for it to be easily integrated with other AWS services,
   such as dynamoDB for the database and the many monitoring tools available. It can also be integrated with an existing AWS CI/CD pipeline.
   Lastly given that AWS Lambda is a serverless function, it gives the development teams the choice of developing it in a language they feel is most suitable without compromising the systems that interact with it.
2. EC2 Instance -

# How you would approach monitoring and
