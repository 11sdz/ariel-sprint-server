const {getEventsController,createEventController} = require('../controllers/eventsController');

const getAllEvents = async (req , res) =>{
    try{
        const events = await getEventsController()
        res.status(201).json(events)
    }
    catch(error){
        console.error('failed to get groups',error)
        res.status(500).json({error: 'failed to get groups'})
    }

}

const createEvent = async(req,res)=>{
    try{
        const event = await createEventController(req.body)
        res.status(201).json(event);
    } catch (error) {
        console.error("Failed to create event:", error);
        res.status(500).json({ error: "Failed to create event " });
    }
}

module.exports={createEvent,getAllEvents}