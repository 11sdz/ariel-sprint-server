const express = require("express");
const router = express.Router();

const communityMemberController = require("../controllers/communityMemberController");

router.post("/", communityMemberController.createCommunityMember);
router.get("/", communityMemberController.getAllCommunityMembers);
router.get("/:id", communityMemberController.getCommunityMemberById);

// Add routes for update, delete, etc.

module.exports = router;
