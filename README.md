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

- /getuser - Get request that takes in an "id" parameter to query the database, i.e.localhost:8080/getuser?id=001
- /createuser - post request that takes in a json object to add a user to the database, template:
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
- /removeuser - post request that takes in a json object to remove user from the database, template:
  let obj = { id: "010" };
  id - is the user ID in the database

- /getallusers - get request that returns all the users in the database, given that my database is relatively small it makes sense to return it in a single call, the data is returned. For a larger database then paramters will need to be included to filter the database.

- /requeststream - post request that checks how many video streams a given user is watching and prevent a user
  from watching more than 3 video streams concurrently. Takes in a JSON object. template:
  let obj = {
  id: "010",
  stream: "stream_100"
  };
