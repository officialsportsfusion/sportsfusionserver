const bookingModel = require('../model/bookingSchema')


const newQuota = async (req, res) =>{
    const {email, current_location, new_location,  services,  vehicle} = req.body
    try{
    const newQuota = await bookingModel.create({email,current_location,new_location,services,vehicle})
    res.status(200).send({
        status: 'new quota',
        message: 'A new user has just been requested',
        data: newQuota
    })

    }catch(err){
        console.log(`${err.message}`)
    }
}

const getQuota = async (req, res) =>{
    try{
    const allQuota = await bookingModel.find({})
    if(!allQuota) res.status(400).send('no quota yet')
    res.status(200).send({
        status: 'all quota',
        message: 'list of all quotas',
        data: allQuota
    })

    }catch(err){
        console.log(`${err.message}`)
    }
}

module.exports = {newQuota, getQuota}