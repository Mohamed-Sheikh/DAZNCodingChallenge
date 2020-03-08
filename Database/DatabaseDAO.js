const data = require("./database.json");
const logger = require("../Middleware/logger");

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
      logger.error(`Error fetching user, ${error}`);
    }
  }
}

module.exports = DatabaseDAO;
