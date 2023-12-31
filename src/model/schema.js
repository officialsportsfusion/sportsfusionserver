const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  newpassword:{
    type:String,
  },
  username: {
    type: String
  },
  otp: {
    type: String
  },
  avatar: {
    type: String,
    default:'https://previews.123rf.com/images/ismailgsv/ismailgsv2003/ismailgsv200300046/142141036-human-icon-design-inspiration-vector-template-for-interface-and-any-purpose.jpg'
  },
  verification:{
    type:Boolean,
    default:false
  },

  tel:{
    type:String,
  },

  country:{
    type:String
  },
  
  role:{
    type:String,
    default:''
  }
});




const freeTipSchema = new mongoose.Schema({
  date:{
    type : String, 
    required:true
  },
  time:{
    type: String,
    required:true
  },
  league:{
    type:String,
    required:true,
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
    type : String, 
    required:true
  },

  time:{
    type:String,
    required:true
  },
  
  match:{
    type:String,
    required:true
  },

  league:{
    type:String,
    require:true,
  },

  odds:{
    type:String,
    require:true
  },

  tip:{
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

const seriesTipsSchema = new mongoose.Schema({
  series:{
    type : String, 
    required:true
  },
  date:{
    type : String, 
    required:true
  },
  stake:{
    type : String, 
    required:true
  },
  time:{
    type:String,
    required:true
  },

  scores:{
    type:String,
    // required:true
  },

  outcome:{
    type:Boolean,
    default:null

  },
  
  match:{
    type:String,
    required:true
  },

  league:{
    type:String,
    require:true,
  },

  odds:{
    type:String,
    require:true
  },

  tip:{
    type:String,
    require:true
  },


},
{
  timestamps:true
}
)

const adminSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },

  password:{
    type:String,
    required:true
  }
},
{
  timestamps:true
}
)


const AccaSchema = new mongoose.Schema({
  date:{
    type : String, 
    required:true
  },

  time:{
    type:String,
    required:true
  },

  category:{
    type:String,
    required:true
  },

  signupLink:{
    type:String,
    required:true
  },

  gameLink:{
    type:String,
    required:true
  },

  status:{
    type:Boolean,
    default:null
  }
})

const admin = mongoose.model('Admin', adminSchema)
const user = mongoose.model('User', userSchema);
const freeTips = mongoose.model('fixedTip', freeTipSchema)
const premiumTips = mongoose.model('premiumTip', premiumTipsSchema)
const seriesTips = mongoose.model('seriesTip', seriesTipsSchema)
const AccaTips = mongoose.model('Acca', AccaSchema)

module.exports = {user, freeTips, premiumTips, seriesTips, AccaTips, admin}
