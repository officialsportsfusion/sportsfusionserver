const {premiumTips} = require('../model/schema')

exports.addPremiumTips = async (req, res)=>{
    try{
    const {date, event, betting_type, odds, tip, tipster} = req.body
    const newPremiumTip = new premiumTips({
            date: date, 
            event :event,
            tip:tip,
            betting_type :betting_type,
            odds :odds,
            tipster :tipster,
        })
    
        await newPremiumTip.save()
       .then(()=>{res
        return res
           .status(201)
           .json({message:'New Free Tip Added', tip:newPremiumTip })})
    
    
    }catch(err){
        console.log(`${err.message}`)
    }
    }
    
    
    exports.getallTips = async(req, res)=>{
        try{
    
            const allpremiumtips=await premiumTips.find({})
            
            if(!allpremiumtips ||
                allpremiumtips === undefined ){
                throw Error(`No Tips Found`)
                
            }else{
                //console.log("All tips are ", alltips);
    
                return res.status(200).send(allpremiumtips)
                }
            
        } catch(error){
            console.log(error.message)
        }
    }
    
    
    exports.deletefreetips = async(req, res) =>{
        try{
        const tipId = req.params.tipId
        let deletedTip = await premiumTips.findByIdAndDelete(tipId)
        
        if (!deletedTip) 
        return res.status(404).json({ message: 'No tip found with the provided ID' });
        
        res.status(200).json({ message:`Deleted a tip`});
            
        }catch(err){
            console.log(`${err.message}`)
        }
    }
    

    exports.updatepremiumTip = async(req, res) =>{
        try{
        const tipId = req.params.tipId
        // const {scores} = req.body
        const tip = await premiumTips.findById(tipId)
        if(!tip) return res.status(400).send({
          message: 'Invalid Id'
        })
      
        // update the database with new data
        let updatedTip = await premiumTips.findByIdAndUpdate(tipId,{...req.body},{new :
          true}).exec();
          res.send(updatedTip);
        }catch(err){
          console.log(err.message)
        }
      }