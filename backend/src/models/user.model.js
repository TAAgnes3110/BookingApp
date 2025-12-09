const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Cho phép null cho OAuth users
        validate: {
          len: [8, 255],
        },
      },
      provider: {
        type: DataTypes.ENUM('local', 'google', 'facebook', 'github'),
        defaultValue: 'local',
      },
      providerId: {
        type: DataTypes.STRING,
        allowNull: true, // ID từ OAuth provider
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true, // URL avatar từ OAuth provider
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (user) => {
          // Chỉ hash password nếu có password và provider là local
          if (user.password && user.provider === 'local') {
            user.password = await bcrypt.hash(user.password, 8);
          }
        },
        beforeUpdate: async (user) => {
          // Chỉ hash password nếu password thay đổi và provider là local
          if (user.changed('password') && user.provider === 'local') {
            user.password = await bcrypt.hash(user.password, 8);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] },
        },
      },
    }
  );

  // Instance methods
  User.prototype.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // Static methods
  User.isEmailTaken = async function (email, excludeUserId) {
    const { Op } = sequelize.Sequelize;
    const user = await this.findOne({
      where: {
        email: { [Op.iLike]: email }, // Case-insensitive cho PostgreSQL
        ...(excludeUserId && { id: { [Op.ne]: excludeUserId } }),
      },
    });
    return !!user;
  };

  // Pagination helper
  User.paginate = async function (filter, options) {
    const { Op } = sequelize.Sequelize;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const offset = (page - 1) * limit;

    let order = [['createdAt', 'DESC']];
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, orderDirection] = sortOption.split(':');
        sortingCriteria.push([key, orderDirection === 'desc' ? 'DESC' : 'ASC']);
      });
      order = sortingCriteria;
    }

    const where = {};
    if (filter) {
      Object.keys(filter).forEach((key) => {
        if (filter[key]) {
          // Case-insensitive search cho email và name trong PostgreSQL
          if (key === 'email' || key === 'name') {
            where[key] = { [Op.iLike]: `%${filter[key]}%` };
          } else {
            where[key] = filter[key];
          }
        }
      });
    }

    const { count, rows } = await this.findAndCountAll({
      where,
      limit,
      offset,
      order,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      results: rows,
      page,
      limit,
      totalPages,
      totalResults: count,
    };
  };

  return User;
};

