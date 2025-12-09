const { sequelize } = require('../config/database');

// Initialize models
// Lưu ý: sequelize có thể null khi file này được require lần đầu
// Nhưng models chỉ được sử dụng sau khi connectDatabase() được gọi trong bin/server.js
const models = {
  User: require('./user.model')(sequelize),
};

module.exports = models;

