const nodemailer = require('nodemailer')
const pug = require('pug')
// const userModel = require('../model/userSchema')
const { convert } = require("html-to-text");
const dotenv = require('dotenv');
dotenv.config()


module.exports = class Email{
    constructor(user){
        this.to = user.email
        this.email = user.email
        this.from = `Tony`
    }

    newTransport() {
        if (process.env.NODE_ENV === "production") {
          //service: SendGrid || MailGun
          return nodemailer.createTransport({
            service: "MailGun",
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
            tls: {
              rejectUnauthorized: false
          }
          });
        }

        return nodemailer.createTransport({
            host: 'smtp.mailgun.org',
            port: 587,
            auth: {
              user: process.env.USER,
              pass: process.env.PASS,
            },
          });
    }

    
  async send(template, info) {
    //send actual email
    //1) Render HTML based on pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      info
    );
    //2) defile email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: info.subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
    };
    //3) create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendResetLink(link) {
    await this.send("resetPassword", {
      subject: "Reset Your Account Password",
      email: this.email,
      link,
    });
  }
}