const {user} = require('../model/schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const EmailService = require("../services/EmailService");
const cloudinary = require('../utilis/cloudinary')
const path = require('path');
const pug = require('pug');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config()



exports.signup = async (req, res) =>{
  try{
  const {email, password, username,tel,country} = req.body
  const verifyEmail = await user.findOne({email})
  if(verifyEmail) return res.status(400).send({
    message:'user already exist'
  })

  const verifyusername = await user.findOne({username})
  if(verifyusername) return res.status(400).send({
    message: 'Username is taken please choose another one.'
  })

  const hashedpassword = await bcrypt.hash(password, 12)

  const otp = Math.floor(1000 + Math.random() * 9000);

  const newUser = new user({
    email:email,
    password:hashedpassword,
    username:username,
    tel : tel,
    country:country,
    otp:otp
  })

  try {
    // const { email, username } = User; // Get user's email and username
    const subject = "Welcome to SportsFusion"; // Set your email subject

    const elasticEmail = {
      host: process.env.SMTP_HOST,
      port: 2525,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(elasticEmail);
    const templatePath = path.join(__dirname, '../../src/utilis/otpTemplate.pug');
    const pugTemplate = pug.compileFile(templatePath);

    // Render the template with the provided data
    const htmlContent = pugTemplate({ email, otp });

    let info = await transporter.sendMail({
      from: "SportsFusion@sportsfusion.io",
      to: email,
      subject: subject,
      text: null,
      html: htmlContent,
    });

    
                              

  } catch (error) {
    console.log(error);
    throw new Error('Failed to send email');
  }
// let Subject = 'OTP Verification'

  // try {
  //   await new EmailService().sendEmail(
  //     {
  //       email: email.toLowerCase(),
  //       subject: Subject,
  //       otp:otp
  //     });
  // } catch (error) {
  //   throw error
  //  }


  await newUser.save()
  delete newUser._doc.password

  res.status(200).send({
    message:'welcome on board ',
    data:newUser
  })
  }catch(err){
    console.log(err.message)
  }
}


exports.confirmOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).send({
        message: 'OTP is required'
      });
    }

    const User = await user.findOne({ otp });
    if (!User) {
      return res.status(400).send({
        message: 'Invalid OTP'
      });
    }

    try {
      const { email, username } = User; // Get user's email and username
      const subject = "Welcome to SportsFusion"; // Set your email subject

      const elasticEmail = {
        host: process.env.SMTP_HOST,
        port: 2525,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      };

      let transporter = nodemailer.createTransport(elasticEmail);
      const templatePath = path.join(__dirname, '../utilis/welcomeTemplate.pug');
      const pugTemplate = pug.compileFile(templatePath);

      // Render the template with the provided data
      const htmlContent = pugTemplate({ email, username });

      let info = await transporter.sendMail({
        from: "SportsFusion@sportsfusion.io",
        to: email,
        subject: subject,
        text: null,
        html: htmlContent,
      });

      
                                

    } catch (error) {
      console.log(error);
      throw new Error('Failed to send email');
    }

    User.verification = true;

    const token = jwt.sign({ _id: User._id }, process.env.SECRET, {
      expiresIn: '1d'
    });

    await User.save();

    res.status(200).send({
      message: 'OTP verified',
      email: User.email,
      id: User._id,
      token: token
    });    
  } catch (err) {
    console.log(err.message);
  }
}


exports.resendOtp = async (req, res) => {
  try {
    const email = req.body.email
    const User = await user.findOne({ email });
    if (!User) {
      return res.status(404).send({ message: 'User not found' });
    }

 
    
  const otp = Math.floor(1000 + Math.random() * 9000);

    User.otp = otp
    await User.save()

    try {
      const { email, username, otp } = User; // Get user's email and username
      const subject = "OTP"; // Set your email subject

      const elasticEmail = {
        host: process.env.SMTP_HOST,
        port: 2525,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      };

      let transporter = nodemailer.createTransport(elasticEmail);
      const templatePath = path.join(__dirname, '../utilis/forgotPassword.pug');
      const pugTemplate = pug.compileFile(templatePath);

      // Render the template with the provided data
      const htmlContent = pugTemplate({ email, username , otp});

      let info = await transporter.sendMail({
        from: "SportsFusion@sportsfusion.io",
        to: email,
        subject: subject,
        text: null,
        html: htmlContent,
      });

      

      User.verification = true;

      const token = jwt.sign({ _id: User._id }, process.env.SECRET, {
        expiresIn: '1d'
      });

      await User.save();

      res.status(200).send({
        message: 'OTP verified',
        email: User.email,
        id: User._id,
        token: token
      });

    } catch (error) {
      console.log(error);
      throw new Error('Failed to send email');
    }

    res.status(200).send({
      message: 'OTP sent to email',
      data: {
        otp: User.otp
      }
    })

  } catch (err) {
    console.error(err)
  }
}

exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;
    const User = await user.findOne({ email });
    if (!User)
      return res.status(400).send({
        message: 'User not found'
      })

    const otp = Math.floor(1000 + Math.random() * 9000);
    User.otp = otp

   

    try {
      const { email, username, otp } = User; // Get user's email and username
      const subject = "Change Password"; // Set your email subject

      const elasticEmail = {
        host: process.env.SMTP_HOST,
        port: 2525,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      };

      let transporter = nodemailer.createTransport(elasticEmail);
      const templatePath = path.join(__dirname, '../utilis/forgotPassword.pug');
      const pugTemplate = pug.compileFile(templatePath);

      // Render the template with the provided data
      const htmlContent = pugTemplate({ email, username , otp});

      let info = await transporter.sendMail({
        from: "SportsFusion@sportsfusion.io",
        to: email,
        subject: subject,
        text: null,
        html: htmlContent,
      });

      

    

      await User.save();

      // res.status(200).send({
      //   message: 'OTP verified',
      //   email: User.email,
      //   id: User._id,
      //   token: token
      // });

    } catch (error) {
      console.log(error);
      throw new Error('Failed to send email');
    }

    await User.save()
    res.status(200).send({
      message: 'OTP Sent'
    })

  } catch (err) {
    console.error(err)
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { otp, password } = req.body;
    const User = await user.findOne({ otp });
    if (!User)
      return res.status(400).send({
        message: 'Invalid OTP'
      })
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    User.password = hash;
    User.otp = undefined
    await User.save();
    res.status(200).send({
      message: 'Password Changed'
    })
  } catch (err) {
    console.error(err)
  }
}

exports.signin = async (req, res) =>{
  try{
  const {email, password} = req.body
  const User = await user.findOne({email})
  if(!User) return res.status(400).send({
      status:'false',
      message:'invalid email'
    })

  if(User.verification === false){
    return  res.status(503).json({"message":"Please verify your account"})
  }
    const verifyPassword = await bcrypt.compare(password, User.password)
    if(!verifyPassword) return res.status(400).send({
      status:'false',
      message:'invalid password'
    })

  //  if(User.verification !== true) return res.status(400).send({
  //   status:'false',
  //   message:' Please verify your account first '
  //  })

   //if verification is false then send a mail to the user with link for verfication of
   //account and after that he can login in his acccount
   
  const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
  expiresIn: '1d'
  });

  res.status(200).json({
  status:"true",
  token :token,
  email:User.email,
  username:User.username,
  id:User._id,
  avatar:User.avatar
    })
  }
  catch(err){
    console.log(err.message)
  }
}




exports.uploadImage = async(req, res)=>{
  try{
   const userId = req.params.userId
   console.log(userId)
   const uploader = async (path) =>
   await cloudinary.uploads(path, 'avatars');
   let url;
   const file = req.file;
   const { path } = file;
   const newPath = await uploader(path);
   url = newPath.url;
   const productstring = url.toString()
   //console.log('image path is ', req.file);
   
   const updateUser =await user.findByIdAndUpdate(
    {_id:userId},
    {$set:{
    avatar:productstring
     }},
    {new: true})

    delete updateUser._doc.password

     res.status(200).json({
    message:'Profile picture updated successfully',
    data:updateUser
    })
              



  }catch(err){
    console.log(err.message)
  }
}
