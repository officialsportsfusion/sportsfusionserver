const {freeTips} = require('../model/schema')


exports.addfreetips = async (req, res) => {
  try {
    const { date, league, match, odds, tipster, tip, time, scores } = req.body;
    const formatTip = tip.charAt(0).toUpperCase() + tip.slice(1).toLowerCase();
    const newFreeTip = new freeTips({
      date: date,
      time: time,
      league: league,
      match: match,
      odds: odds,
      tip: formatTip,
      tipster: tipster,
      scores: scores,
    });

    await newFreeTip.save();
    res.status(201).json({ message: 'New Free Tip Added', tip: newFreeTip });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.getallTips = async(req, res)=>{
    try{

        const allfreetips= await freeTips.find({})
        if(!allfreetips ||
            allfreetips === undefined ){
            throw Error(`No Tips Found`)
            
        }else{
            //console.log("All tips are ", alltips);

            return res.status(200).send(allfreetips)
            }
        
    } catch(error){
        console.log(error.message)
    }
}


exports.deletefreetips = async (req, res) => {
    try {
      const tipId = req.params.tipId;
      const deletedTip = await freeTips.findByIdAndDelete(tipId);
  
      if (!deletedTip) 
        return res.status(404).json({ message: 'No tip found with the provided ID' });
      
  
       res.status(200).json({ message: `Deleted` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  
  exports.updatefreeTip = async(req, res) =>{
    try{
    const tipId = req.params.tipId
    // const {scores} = req.body
    const tip = await freeTips.findById(tipId)
    if(!tip) return res.status(400).send({
      message: 'Invalid Id'
    })
  
    // update the database with new data
    let updatedTip = await freeTips.findByIdAndUpdate(tipId,{...req.body},{new :
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
    const tip = await freeTips.findById(tipId)
    if(!tip) return res.status(400).send({
      message: 'Invalid Id'
    })
  
      res.send(tip);
    }catch(err){
      console.log(err.message)
    }
  }