# DAZNCodingChallenge

- Run npm install in the root directory such that all the dependencies are installed
- Run Node index.js to start the server.

# Test

- Run npm test in the root directory to run all the tests

# Notes

- Used JSON to mimic database so there is no integration test. Given the nature of the program,
  my database of choice would have been DynamoDB.
- Logging can be found in the Middleware folder
- Omited authorising the api as instructed in the brief

# API

- **/getuser** - Get request that takes in an "id" parameter to query the database, i.e.localhost:8080/getuser?id=001
- **/createuser** - POST request that takes in a json object to add a user to the database, template:
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
- **/removeuser** - POST request that takes in a json object to remove user from the database.
  Body = { id: "010" };
  id - is the user ID in the database

- **/getallusers** - GET request that returns all the users in the database, given that my database is relatively small it makes sense to return it in a single call. For a larger database then parameters will need to be included to filter the database.

- **/requeststream** - POST request that checks how many video streams a given user is watching and prevents a user
  from watching more than 3 video streams concurrently. Takes in a JSON object as the body. template:
  {
  id: "010",
  stream: "stream_100"
  }
  id = ID of the user.
  stream = the requested stream.

# How would I scale the solution to millions of users?

EC2 Instance - I would scale the solution to millions of users by deploying it on an Amazon EC2 instance. The biggest advantage of doing so is the ASG (auto-scaling group) capabilities that Amazon provide. Resultantly, as the system grows in regards to traffic and number of concurrent users, so do the virtual machines running the system, as it is automatically scaled up and down to meet the desired capacity. The developer or the team is given the granularity to define when a new instance should be scaled up or down based on the configurations they define. This capability along with elastic load balancing which automatically distributes incoming application traffic across multiple targets make it a good choice.

AWS Lambda - If the system was to be deployed to a subset of the users or a significantly smaller user base, then I would deploy it on AWS Lambda. 
It allows for the system to be deployed as a serverless function, completely decoupling it from any systems that interact with it, making it easier to test, deploy, maintain and most importantly scale. AWS offers an autoscaling system whereby systems are automatically scaled up or down depending on their usage. In addition, by having this system run on AWS Lambda it allows for it to be easily integrated with other AWS services, such as API gateway, DynamoDB for the database and the many monitoring tools available. It can also be integrated with an existing AWS CI/CD pipeline.

# How would you approach logging & monitoring at scale?

This question ties into my response above. Providing the system is deployed on of the two methods mentioned above, then I would use AWS CloudWatch for monitoring. CloudWatch provides, logging, data and actionable insights to monitor the system, analyse and respond to system wide performance changes and optimise resource utilisation. CloudWatch presents and collects data in the form of logs (CloudWatch Logs), metrics and events providing a unified view of all of the AWS resources in use and their respective health. One of the best capabilities of CloudWatch is its alarm capability, whereby you can define alarms and take automated actions. i.e. if a health check fails (a periodic request to one of our endpoints) or if we have hit the maximum size of our defined auto scaling group then we can define a custom automated response. In addition to monitoring, we can visualise logs and metrics to discover insights to optimise the system.

# How can this be made to be production ready?

- Use a proper database, such as DynamoDB or MongoDb
- Implement proper API documentation, e.g. SwaggerHub
- Implement API Authorization
