const fs = require('fs');
const {writeFileSync} = require('fs');
const path = require('path');

const Handlebars = require('handlebars');

const { transport } = require('../common');

const { FRONTEND_URL_DEV, MESSENGER } = process.env;

const verifySource = fs.readFileSync(`${__dirname}/verify.handlebars`, 'utf-8');
// const resetSource = fs.readFileSync(`${__dirname}/reset.handlebars`, 'utf-8');

// Include partials like header footer
Handlebars.registerPartial('header', fs.readFileSync(`${__dirname}/partials/header.handlebars`, 'utf8'));
Handlebars.registerPartial('footer', fs.readFileSync(`${__dirname}/partials/footer.handlebars`, 'utf8'));
Handlebars.registerPartial('tableFooter', fs.readFileSync(`${__dirname}/partials/table-footer.handlebars`, 'utf8'));

const verifyEmailTemplate = Handlebars.compile(verifySource);
// const resetPasswordTemplate = Handlebars.compile(resetSource);

const title = 'Loop';
const emailFrom = `${title} from Vizard <${MESSENGER}>`;


const cal = require("ics");

cal.createEvent(
  {
    title: "Test-Ashiqur Rahman",
    description: "Nightly thing I do",
    busyStatus: "FREE",
    start: [2018, 1, 1, 6, 30],
    startInputType: 'local',
    duration: { minutes: 50 }
  },
  (error, value) => {
    if (error) {
      console.log(error);
    }
    writeFileSync(
      path.join(__dirname, "event.ics"),
      value
    );
  }
);

async function sendEmailVerification({ email, emailToken }) {
  try {
    // const verifyUrl = `${FRONTEND_URL_DEV}/verify?code=${verificationCode}`;

    // Send email with verification url
    await transport.sendMail({
      from: process.env.ADMIN_MAIL,
      to: email,
      subject: "Email verification",
      html: verifyEmailTemplate({ email, emailToken }),
      // attachments: [
      //   {
      //     filename: "test.ics",
      //     path: path.join(
      //       __dirname,
      //       "..",
      //       "mail_templates",
      //       "event.ics"
      //     )
      //   }
      // ]
      icalEvent: {
        method: "PUBLISH",
        path: '/home/ashik/graphql-with-prisma/src/resolvers/mail_templates/event.ics'
      },
      // alternatives: [{
      //   contentType: "text/calendar",
      //   content: new Buffer(cal.toString())
      // }]
    });

    return { message: 'Verification url sent to your mail' };
  } catch (error) {
    console.log(error);
    throw new Error('Cannot send email.');
  }
}

async function sendResetToken({ resetToken, email }) {
  try {
    const resetTokenUrl = `${FRONTEND_URL_DEV}/reset?resetToken=${resetToken}`;
    // send email with reset token
    transport.sendMail({
      from: emailFrom,
      to: email,
      subject: `${title} | reset your password`,
      html: resetPasswordTemplate({ resetTokenUrl }),
    });
    return { message: 'password reset token is sent to your mail' };
  } catch (error) {
    console.log(error);
    throw new Error('Cannot send email.');
  }
}

module.exports = { sendEmailVerification, sendResetToken };
