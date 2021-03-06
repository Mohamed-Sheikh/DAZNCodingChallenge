"use strict";
const data = require("./database.json");
const logger = require("../Middleware/logger");
const uuid = require("uuid");
const fs = require("fs");

class DatabaseDAO {
  static getUser(id) {
    logger.info(`Request to get user ${id}`);
    let UserId = id;
    try {
      if (!data.Users[UserId]) {
        return false;
      }
      logger.info(`Successfully returned user${id}`);
      return data.Users[UserId];
    } catch (error) {
      logger.error(
        `Error fetching user, ${error}, function: ${this.getUser.name}`
      );
    }
  }
  static createUser(body) {
    logger.info(`Request to create user`);
    try {
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

      data.Users[userId] = obj;
      fs.writeFile("Database/database.json", JSON.stringify(data), err => {
        if (err) {
          console.error("Can't update file--", err);
          logger.error(
            `Error writing to database - user not created, ${error}, function: ${this.createUser.name}`
          );
        }
      });
      return true;
    } catch (error) {
      logger.error(
        `Error creating user, ${error}, function: ${this.createUser.name}`
      );
      return false;
    }
  }

  static addStream(id, stream, user) {
    logger.info(`Request to add stream to user:${id}`);
    let UserId = id;
    try {
      if (!user) {
        return false;
      }
      let activeStreams = user.Status.Online.Streams.activeStreams;
      let currentStreams = user.Status.Online.Streams.watching;
      switch (true) {
        case currentStreams.includes(stream):
          logger.info(`User ${UserId} is already watching stream requested`);
          return `User ${id} is already watching ${stream}`;
        case activeStreams >= process.env.concurrentLimit:
          logger.info(
            `User ${UserId} has attempted to watch new stream - concurrent stream limit exceeded`
          );
          return `User - ${UserId} has exceeded maximum concurrent streams allowed.`;
        default:
          /*in reality would write to a database,
            database of choice being DynamoDb, 
            writing to a local json file to mimic
            data */
          activeStreams += 1;
          data.Users[
            UserId
          ].Status.Online.Streams.activeStreams = activeStreams;
          data.Users[UserId].Status.Online.Streams.watching.push(
            stream.toLowerCase()
          );
          fs.writeFile(
            "./Database/Database.json",
            JSON.stringify(data),
            err => {
              if (err) {
                logger.error(
                  `Can't update database. ${error}, function: ${this.addStream.name}`
                );
              }
            }
          );
          logger.info(`Successfully updated database`);
          logger.info(
            `User ${UserId} has attempted to watch new stream (${stream}) - request successful`
          );
          return `Request for ${stream} succesful`;
      }
    } catch (error) {
      logger.error(
        `Error adding stream to user ${user}, ${error}, function: ${this.addStream.name}`
      );
    }
  }
  static deleteUser(id) {
    logger.info(`Request to delete user:${id}`);
    try {
      if (!data["Users"][id]) {
        return false;
      }

      //Deleting user, in reality would make a call to a database to achieve this.
      delete data["Users"][id];

      fs.writeFile("Database/database.json", JSON.stringify(data), err => {
        if (err) {
          console.error("Can't update file--", err);
          logger.error(
            `Error writing to database - user not created, ${error}, function: ${this.deleteUser.name}`
          );
        }
      });
      logger.info(`Successfully removed user ${id} from database`);
      return `user ${id} successfully deleted`;
    } catch (error) {
      logger.error(
        `Error deleting user ${id} from database stream to user, ${error}, function: ${this.deleteUser.name}`
      );
    }
  }

  static getAllUsers() {
    try {
      logger.info(`Request to get all users`);
      return data;
    } catch (error) {
      logger.error(
        `Error fetching all users, ${error}, function: ${this.getAllUsers.name}`
      );
    }
  }
}

module.exports = DatabaseDAO;
