const {user} = require('../model/schema')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()



exports.updateUser = async(req, res) =>{
  try{
  const userId = req.params.user
  const {username} = req.body
  const User = await user.findById(userId)
  if(!User) return res.status(400).send({
    message: 'Invalid Id'
  })

  const availableUsername = await user.findOne({username})
  if(availableUsername) return res.status(400).send({
    message:'This username is already taken.'
  })

  // update the database with new data
  let updatedUser = await user.findByIdAndUpdate(userId,{...req.body},{new :
    true}).exec();
    res.send(updatedUser);
  }catch(err){
    console.log(err.message)
  }
}


exports.editPassword = async (req, res) =>{
  try{
    const userId = req.params.userId
    const {password} = req.body
    const User = await user.findById(userId) 
    if(!User) return res.status(400).send({
      message:'Invalid Id'
    })

    const comparePassword = await bcrypt.compare(password, User.password)
    if(!comparePassword) return res.status(400).send({
      message:'your old passwords are incorrect'
    })

    const hashedPassword = await bcrypt.hash(password, 12)
    User.password = hashedPassword
    await User.save().then(() =>res.json("Your password has been changed"))
  }catch(err){
    console.log(err.message)
  }
}