const {getGroupsController} = require('../controllers/groupsController');

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

module.exports={getAllGroups}