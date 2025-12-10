const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch((error) =>
      logger.warn(
        `Unable to connect to email server. Make sure you have configured the SMTP options in .env\n${error}`
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} [html]
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace with actual link
  const resetPasswordUrl = `${config.cors.origin}/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationUrl = `${config.cors.origin}/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send OTP email
 * @param {string} to
 * @param {string} otp
 * @returns {Promise}
 */
const sendOTP = async (to, otp) => {
  const subject = 'Your OTP Code';
  const text = `Your OTP code is: ${otp}. It is valid for 10 minutes.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendOTP
};
