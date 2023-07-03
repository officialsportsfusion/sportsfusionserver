const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true
  },
  password: {
    type: String,
    required:true
  },
  newpassword:{
    type:String,
  },
  username: {
    type: String,
    required:true
  },
  otp: {
    type: String,
    required:true
  },
  avatar: {
    type: String,
  },
  verification:{
    type:Boolean,
    default:false
  }
});




const freeTipSchema = new mongoose.Schema({
  date:{
    type : Date, 
    default:Date.now(),
    required:true
  },
  
  league:{
    type:String,
    required:true
  },

  match:{
    type:String,
    required:true
  },


  odds:{
    type:String,
    required:true
  },

  tipster:{
    type:String,
    required:true,
    default:'SportsFusion'
  },

  tip:{
    type:String,
    required:true
  },

  scores:{
    type:String,
    required:true
  }
},
{
  timestamps:true
}
)


const premiumTipsSchema = new mongoose.Schema({
  date:{
    type : Date, 
    default:Date.now(),
    required:true
  },
  
  event:{
    type:String,
    required:true
  },

  betting_type:{
    type:String,
    require:true
  },

  odds:{
    type:String,
    require:true
  },

  tipster:{
    type:String,
    require:true,
    default:'Sports Fusion'
  }
},
{
  timestamps:true
}
)


const user = mongoose.model('User', userSchema);
const freeTips = mongoose.model('fixedTip', freeTipSchema)
const premiumTips = mongoose.model('premiumTip', premiumTipsSchema)

module.exports = {user, freeTips, premiumTips}
