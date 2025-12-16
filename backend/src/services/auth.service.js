const { sequelize } = require('../config/database');
const logger = require('../config/logger');

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => sequelize.models.User.findByPk(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => sequelize.models.User.findOne({ where: { email } });

/**
 * Find or create user from OAuth profile (Google, Facebook)
 * @param {Object} profile - Passport profile object
 * @param {string} provider - 'google', 'facebook', etc.
 * @returns {Promise<User>}
 */
const findOrCreateSocialUser = async (profile, provider) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, emails, name, photos, displayName } = profile;
    const email = emails && emails[0] ? emails[0].value : null;
    const avatarUrl = photos && photos[0] ? photos[0].value : null;
    const firstName = name && name.givenName ? name.givenName : displayName;
    const lastName = name && name.familyName ? name.familyName : '';

    if (!email) {
      throw new Error(`${provider} account does not have an email address.`);
    }

    // 1. Check if user already exists with this provider
    let user = await sequelize.models.User.findOne({
      where: {
        provider,
        provider_id: id
      },
      transaction
    });

    if (user) {
      await transaction.commit();
      return user;
    }

    user = await sequelize.models.User.findOne({ where: { email }, transaction });

    if (user) {
      if (user.provider === 'local' || !user.provider) {
        user.provider = provider;
        user.providerId = id;
        if (!user.avatarUrl) user.avatarUrl = avatarUrl;
        await user.save({ transaction });
      }
      await transaction.commit();
      return user;
    }

    const newUser = await sequelize.models.User.create({
      email,
      firstName,
      lastName,
      username: email.split('@')[0] + Math.floor(Math.random() * 1000),
      provider,
      providerId: id,
      avatarUrl,
      isEmailVerified: true,
      roleId: 5,
      status: 'active'
    }, { transaction });

    await transaction.commit();
    return newUser;

  } catch (error) {
    await transaction.rollback();
    logger.error(`Error in findOrCreateSocialUser (${provider}):`, error);
    throw error;
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  findOrCreateSocialUser
};
