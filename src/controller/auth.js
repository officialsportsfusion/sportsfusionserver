const {user} = require('../model/schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('../utilis/cloudinary')
const path = require('path');
const speakeasy = require('speakeasy');
const pug = require('pug');
const mailgunTransport = require('nodemailer-mailgun-transport');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config()

const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: process.env.MAILGUN_APIKEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  }));


exports.signup = async (req, res) =>{
  try{
  const {email, password, username} = req.body
  const verifyEmail = await user.findOne({email})
  if(verifyEmail) return res.status(400).send({
    message:'user with already exist'
  })

  const verifyusername = await user.findOne({username})
  if(verifyusername) return res.status(400).send({
    message: 'Username is taken please choose another one.'
  })

  const hashedpassword = await bcrypt.hash(password, 12)

  // const secret = speakeasy.generateSecret();

  // const otp = speakeasy.totp({
  //   secret: secret.base32,
  //   encoding: 'base32',
  //   window: 10 * 60,
  // });

  const newUser = new user({
    email:email,
    password:hashedpassword,
    username:username,
  })


  

  // const templatePath = path.join(__dirname, '../utilis/otptemplate.pug');
  // const compiledTemplate = pug.compileFile(templatePath);
  // const html = compiledTemplate({ otp, email });

  // transporter.sendMail({
  //   from: 'officialtony@gmail.com',
  //   to: newUser.email,
  //   subject: 'OTP Verification',
  //   html: html
  // }, (err, info) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log('Email sent:', info.status);
  //   }
  // });

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
    const { otp } = req.body
    if (!otp) {
      return res.status(400).send({
        message: 'OTP is required'
      })
    }
    const User = await user.findOne({ otp })
    if (!User)
      return res.status(400).send({
        message: 'Invalid OTP'
      })

    User.verification = true
    User.otp = undefined


    const token = jwt.sign({ _id: User._id }, process.env.SECRET, {
      expiresIn: '1d'
    });

    await User.save()

    res.status(200).send({
      message: 'OTP verified',
      email: User.email,
      id: User._id,
      token: token
    });
  }catch(err){
    console.log(err.message)
  }
}

exports.resendOtp = async (req, res) => {
  try {
    const email = req.body.email
    const User = await user.findOne({ email });
    if (!User) {
      return res.status(404).send({ message: 'User not found' });
    }

    const secret = speakeasy.generateSecret();
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      window: 10 * 60,
    });

    User.otp = otp
    await User.save()

    const templatePath = path.join(__dirname, '../utilis/otptemplate.pug');
    const compiledTemplate = pug.compileFile(templatePath);
    const html = compiledTemplate({ otp });

    transporter.sendMail({
      from: 'SportsFusion.io',
      to: User.email,
      subject: 'OTP Verification',
      html: html
    }, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Email sent:', info.status);
      }
    });

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


    const secret = speakeasy.generateSecret();

    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      window: 10 * 60,
    });

    User.otp = otp

    await User.save()

    const templatePath = path.join(__dirname, '../utilis/otpTemplate.pug');
    const compiledTemplate = pug.compileFile(templatePath);
    const html = compiledTemplate({ otp });

    transporter.sendMail({
      from: 'SportsFusion.io',
      to: User.email,
      subject: 'Reset Password',
      html: html
    }, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Email sent:', info.status);
      }
    });

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
    Userser.password = hash;
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
