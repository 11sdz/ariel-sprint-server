const {getGroupsController,createGroupController} = require('../controllers/groupsController');

const getAllGroups = async (req , res) =>{
    try{
        const groups = await getGroupsController()
        res.status(201).json(groups)
    }
    catch(error){
        console.error('failed to get groups',error)
        res.status(500).json({error: 'failed to get groups'})
    }

}

const createGroup = async(req,res)=>{
    try{
        const group = await createGroupController(req.body)
        res.status(201).json(group);
    } catch (error) {
        console.error("Failed to create group:", error);
        res.status(500).json({ error: "Failed to create group " });
    }
}

module.exports={createGroup,getAllGroups}