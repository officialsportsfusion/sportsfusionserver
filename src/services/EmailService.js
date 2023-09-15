const axios = require("axios");
const nodemailer = require("nodemailer");
const path = require('path');

const pug = require("pug");
const newTemplate = require("../EmailTemplate/EmailTemplate");

class EmailService {

    async sendEmail(payload) {
        
      try{
        const { subject, email, otp } = payload;

        const elasticEmail = {
            host: process.env.SMTP_HOST,
            port: 587,
            auth: {
              user: process.env.SMTP_USERNAME,
              pass: process.env.SMTP_PASSWORD
            },
          };
    
          // var transport = nodemailer.createTransport({
          //   host: "live.smtp.mailtrap.io",
          //   port: 587,
          //   auth: {
          //     user: "api",
          //     pass: "141296650f045fae9a554592f807841a"
          //   }
          // });
          let transporter = nodemailer.createTransport(elasticEmail);
          const templatePath = path.join(__dirname, '../utilis/otptemplate.pug');
          const pugTemplate = pug.compileFile(templatePath);


 
          // Render the template with the provided data
          const htmlContent = pugTemplate({ email, otp });
          try {
            let info = await transporter.sendMail({
              from: "sportsfusion@sportsfusion.io",
              to: email,
              subject: subject,
              text: null,
              html: htmlContent,
            });
    
            return info;
          } catch (error) {
            console.log(error);
            throw new Error('Failed to send email');
          }
      }catch(error){
          console.log(error);
          throw new Error()
      }
    }

}
module.exports = EmailService