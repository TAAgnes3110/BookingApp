const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (plainPassword, hashedPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);

module.exports = { hashPassword, comparePassword };
