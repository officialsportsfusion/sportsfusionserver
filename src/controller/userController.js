const userModel = require('../model/userSchema')
const bcrypt = require('bcrypt')
const Email = require('../utilis/sendEmail')
const JWT = require('jsonwebtoken')

const signUp = async (req, res)=>{
    const { email, password } = req.body
    try {
        const checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) return res.send('Email already exists')

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await userModel.create({ email, password:hashedPassword })

        res.status(200).send({
            status: 'new user',
            message: 'A new user has just been created',
            data: newUser
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 'error',
            message: 'An error occurred while creating a new user'
        })
    }
}

const signIn = async (req, res)=>{
    const {email, password} = req.body
    try{
    const User = await userModel.findOne({email})
    //validate email
    if (!User) return res.status(500).send('Email not found')

    //validate password
    const validatePassword = await bcrypt.compare(password, User.password)
    if (!validatePassword) return res.status(500).send('password not found')


    //create a token
    const SECRET = process.env.SECRET
    const token = JWT.sign({id:User.id, password:User.password, email:User.email}, SECRET)
    console.log(token)

    delete User._doc.password
    res.status(200).send({
        message:'successfully signed in',
        data:User,
        token:token
    })
    }catch(err){
        console.log(err)
        res.status(500).send({
            status: 'error',
            message: 'An error occurred while signing in'
        })
    }
}

const forgotPassword = async (req, res)=>{
    const {email} = req.body
    try{
    const User = await userModel.findOne({email})
    if(!User) return res.status(400).send({message:'email does not exist'})

    
    const SECRET = process.env.SECRET

    const token = JWT.sign({id:User._id}, SECRET, {expiresIn:'3h'})

    const link = `${process.env.PORT}/${User._id}/${token}`

    await new Email(User).sendResetLink(link)

    res.send('password reset link sent')

    }catch(err){
        console.log(err)
        res.status(500).send({
            status: 'error',
            message: 'An error occurred while signing in'
        })
    }
}

    module.exports = {signUp, signIn, forgotPassword}