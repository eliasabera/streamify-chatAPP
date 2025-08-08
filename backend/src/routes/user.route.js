import express from 'express';
import { getRecommandedUser, getMyFriends } from "../controllers/user.controller.js";
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();
router.use(protectRoute)

router.get('/',getRecommandedUser)
router.get('friends',getMyFriends)



export default router