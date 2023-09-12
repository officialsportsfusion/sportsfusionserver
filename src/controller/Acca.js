const {AccaTips} = require('../model/schema')


exports.addAccatips = async (req, res) => {
  try {
    const { date, time, category, signupLink, gameLink } = req.body;
    // const formatTip = tip.charAt(0).toUpperCase() + tip.slice(1).toLowerCase();
    const newAccaTip = new AccaTips({
      date: date,
      time: time,
      category:category,
      signuplink : signupLink,
      gamelink  :   gameLink
    
    });

    await newAccaTip.save();
    res.status(201).json({ message: 'New Free Tip Added', tip: newAccaTip });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.getallTips = async(req, res)=>{
    try{

        const allAccatips= await AccaTips.find({})
        if(!allAccatips ||
            allAccatips === undefined ){
            throw Error(`No Tips Found`)
            
        }else{
            //console.log("All tips are ", alltips);

            return res.status(200).send(allAccatips)
            }
        
    } catch(error){
        console.log(error.message)
    }
}


exports.deleteAccatips = async (req, res) => {
    try {
      const tipId = req.params.tipId;
      console.log('delete')
      const deletedTip = await AccaTips.findByIdAndDelete(tipId);
  
      if (!deletedTip) 
        return res.status(404).json({ message: 'No tip found with the provided ID' });
      
  
       res.status(200).json({ message: `Deleted` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  
  exports.updateAccaTip = async(req, res) =>{
    try{
    const tipId = req.params.tipId
    // const {scores} = req.body
    const tip = await AccaTips.findById(tipId)
    if(!tip) return res.status(400).send({
      message: 'Invalid Id'
    })
  
    // update the database with new data
    let updatedTip = await AccaTips.findByIdAndUpdate(tipId,{...req.body},{new :
      true}).exec();

      res.send(updatedTip);
    }catch(err){
      console.log(err.message)
    }
  }


  exports.getTip = async(req, res) =>{
    try{
    const tipId = req.params.tipId
    // const {scores} = req.body
    const tip = await AccaTips.findById(tipId)
    if(!tip) return res.status(400).send({
      message: 'Invalid Id'
    })
  
      res.send(tip);
    }catch(err){
      console.log(err.message)
    }
  }