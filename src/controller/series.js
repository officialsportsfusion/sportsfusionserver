const {seriesTips} = require('../model/schema')


exports.addseriestips = async (req, res) => {
  try {
    const { date, league, match, odds, tip, time, series, scores } = req.body;
    const formatTip = tip.charAt(0).toUpperCase() + tip.slice(1).toLowerCase();
    const newseriesTip = new seriesTips({
      date: date,
      time: time,
      league: league,
      match: match,
      odds: odds,
      tip: formatTip,
      scores: scores,
      series:series
    });

    await newseriesTip.save();
    res.status(201).json({ message: 'New Free Tip Added', tip: newseriesTip });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.getallTips = async(req, res)=>{
    try{

        const allseriestips= await seriesTips.find({})
        if(!allseriestips ||
            allseriestips === undefined ){
            throw Error(`No Tips Found`)
            
        }else{
            //console.log("All tips are ", alltips);

            return res.status(200).send(allseriestips)
            }
        
    } catch(error){
        console.log(error.message)
    }
}


exports.deleteseriestips = async (req, res) => {
    try {
      const tipId = req.params.tipId;
      const deletedTip = await seriesTips.findByIdAndDelete(tipId);
  
      if (!deletedTip) 
        return res.status(404).json({ message: 'No tip found with the provided ID' });
      
  
       res.status(200).json({ message: `Deleted` });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };


  
  exports.updateSeriesTip = async(req, res) =>{
    try{
    const tipId = req.params.tipId
    // const {scores} = req.body
    const tip = await seriesTips.findById(tipId)
    if(!tip) return res.status(400).send({
      message: 'Invalid Id'
    })
  
    // update the database with new data
    let updatedTip = await seriesTips.findByIdAndUpdate(tipId,{...req.body},{new :
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
    const tip = await seriesTips.findById(tipId)
    if(!tip) return res.status(400).send({
      message: 'Invalid Id'
    })
  
      res.send(tip);
    }catch(err){
      console.log(err.message)
    }
  }