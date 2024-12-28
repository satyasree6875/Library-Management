const Sequelize = require("sequelize");
const sequelize = new Sequelize("node-complete", "root", "Ka45h8k@", {
  dialect: "mysql",
  host: "localhost",
  port: 3306
});
module.exports=sequelize;