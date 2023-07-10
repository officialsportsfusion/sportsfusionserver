const {admin} = require ("../model/schema.js")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.signup = async (req, res) =>{
    try{
    const {email, password} = req.body
    const verifyEmail = await admin.findOne({email})
    if(verifyEmail) return res.status(400).send({
      message:'user with already exist'
    })
    const hashedpassword = await bcrypt.hash(password, 12)
    const newAdmin = new admin({
      email:email,
      password:hashedpassword,
    })
    await newAdmin.save()
    delete newAdmin._doc.password
    res.status(200).send({
      message:'welcome on board ',
      data:newAdmin
    })
    }catch(err){
      console.log(err.message)
    }
  }


  
exports.signin = async (req, res) =>{
    try{
    const {email, password} = req.body
    const User = await admin.findOne({email})
    if(!User) return res.status(400).send({
        status:'false',
        message:'invalid email'
      })
  
      const verifyPassword = await bcrypt.compare(password, User.password)
      if(!verifyPassword) return res.status(400).send({
        status:'false',
        message:'invalid password'
      })
  

     
    const token = jwt.sign({ _id: admin._id }, process.env.SECRET, {
    expiresIn: '1d'
    });
  
    res.status(200).json({
    status:"true",
    token :token
      })
    }
    catch(err){
      console.log(err.message)
    }
  }